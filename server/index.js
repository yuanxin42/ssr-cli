const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const KoaRuoter = require('koa-router')
const serve = require('koa-static')
const {
    createBundleRenderer
} = require('vue-server-renderer')
const ssrPages = require("./ssrPages");

const {ssrPort, ip, devPort} = require("../config/index");
// const csrPages = require("./csrPages");

const resolve = file => path.resolve(__dirname, file)
const app = new Koa()
const router = new KoaRuoter()
app.use(router.routes()).use(router.allowedMethods())

app.use(serve(path.join(__dirname, '../dist'), {
    index: false
}));

app.use(serve(path.join(__dirname, '../public'), {
    index: false
}));

const template = fs.readFileSync(resolve('../public/index.temp.html'), 'utf-8')

/**
 * 渲染函数
 *
 * @param url
 * @param cb
 */
const ssrRender = (url, cb) => {
    const createRenderer = (bundle, options) => {
        return createBundleRenderer(
            bundle,
            Object.assign(options, {
                template,
                basedir: resolve('./dist'),
                runInNewContext: false
            })
        )
    }
    const context = {
        title: 'Vue Ssr 2.3',
        url
    }
    const bundle = require('../dist/vue-ssr-server-bundle.json')
    const clientManifest = require('../dist/vue-ssr-client-manifest.json')
    const renderer = createRenderer(bundle, {
        clientManifest
    })
    renderer.renderToString(context, (err, html) => {
        cb(html, err)
    })
}

/**
 * 渲染函数
 * @param ctx
 * @returns {Promise}
 */
const handleRequest = ctx => {
    ctx.set("Content-Type", "text/html")
    const hasSsrPath = ssrPages.find(v => v.path === ctx.path);
    // const hasCsrPath = csrPages.find(v => v.path === ctx.path);
    if (hasSsrPath) {
        ssrRender(ctx.url, html => {
            ctx.body = html
        })
    } 
    // else if(hasCsrPath) {
    //     ctx.body = template
    // } 
    else {
        ctx.status = 404
        ctx.body = '404 | Page Not Found'
    }
}

app.use(handleRequest);

// 监听请求
app.listen(ssrPort, ip,() => {
    console.log(`Node Server: http://${ip}:${ssrPort}`);
    console.log(`client Server: http://${ip}:${devPort}`);
});