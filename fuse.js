const { exec: spawn } = require('child_process');
const { join } = require('path');
const { FuseBox, BabelPlugin, WebIndexPlugin } = require('fuse-box');
const { task, watch, exec } = require('fuse-box/sparky');

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
    return watch('**/**.**', {
        base: join(__dirname, 'src'),
    }, () => exec('build'));
});

task('test', ['build:watch'], () => {
    const { vendor, app } = initFuseTest();

    app.fuse.dev({
        port: 3000,
        fallback: 'index.html',
    });

    vendor.watch();
    app.hmr().watch();
    return app.fuse.run();
});
