const { exec: spawn } = require('child_process');
const fs = require('fs');
const { join } = require('path');
const { FuseBox, BabelPlugin, WebIndexPlugin } = require('fuse-box');
const { task, watch, exec } = require('fuse-box/sparky');
const ejs = require('ejs');
const glob = require('glob');
const yaml = require('yaml');
const _sortBy = require('lodash.sortby');
const { Parser, HtmlRenderer } = require('commonmark');
const util = require('util');
const StaticServer = require('static-server');

const writeFile = util.promisify(fs.writeFile);

const getMdFiles = () => new Promise((res, rej) => {
    glob('*.md', {
        cwd: join(__dirname, 'docs', 'md'),
    }, (err, m) => {
        if (err) {
            rej(err);
            return;
        }

        res(m);
    })
});

const readFile = path => new Promise((res, rej) => {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            rej(err);
            return;
        }

        res(data);
    });
});

const initFuseTest = () => {
    const fuse = new FuseBox({
        homeDir: '',
        target: 'browser@es2017',
        output: 'test/dist/$name.js',
        useTypescriptCompiler: true,
        sourceMaps: true,
        alias: {
            byakko: '~/dist/main.js',
            react: 'preact/compat',
            'react-dom': 'preact/compat',
        },
        plugins: [
            WebIndexPlugin({
                title: 'Byakko Test',
                template: 'test/src/index.html',
                path: '.',
                resolve: output => '/'.concat(output.lastPrimaryOutput.filename),
            }),
            BabelPlugin({
                config: {
                    plugins: [['transform-react-jsx', { pragma: 'React.h' }]],
                },
            }),
        ]
    });

    return {
        vendor: fuse.bundle('vendor').instructions('~ test/src/index.tsx'),
        app: fuse.bundle('app').instructions('> test/src/index.tsx'),
    };
};

task('build', () => {
    return new Promise(res => {
        spawn('npm run build', {
            cwd: __dirname,
        }, () => {
            res();
        });
    });
});

task('build:watch', () => {
    return watch('src/**/**.**', {
        base: __dirname,
    }, () => exec('build'));
});

task('docs', async () => {
    const mdsPaths = await getMdFiles();
    const mds = await Promise.all(mdsPaths.map(x => join(__dirname, 'docs', 'md', x)).map(readFile));
    const entries = mds.map(x => {
        let header = {};
        let body = x;

        if (/^[\s\r\n]*-{3}/.test(x)) {
            const [, h, ...r] = x.split('---');
            header = yaml.parse(h);
            body = r.join('---');
        }

        return { ...header, body };
    });
    entries.forEach(x => {
        x.body = (new HtmlRenderer()).render((new Parser()).parse(x.body || ''));
        x.order = x.order || 999;
        x.orderName = (x.name || '').toLowerCase();
    });
    const sortedEntries = _sortBy(entries, ['order', 'orderName']);

    const res = await ejs.renderFile(join(__dirname, 'docs', 'index.ejs'), { items: sortedEntries });
    await writeFile(join(__dirname, 'docs', 'index.html'), res, { encoding: 'utf8' });
    return true;
});

task('docs:watch', () => {
    const server = new StaticServer({
        rootPath: join(__dirname, 'docs').concat('\\'),
        port: 9090,
    })

    server.start();

    return watch('docs/**/**.{md,ejs}', {
        base: __dirname,
    }, () => exec('docs'));
});

task('test', ['build:watch', 'docs:watch'], () => {
    const { vendor, app } = initFuseTest();

    app.fuse.dev({
        port: 3000,
        fallback: 'index.html',
    });

    vendor.watch();
    app.hmr().watch();
    return app.fuse.run();
});
