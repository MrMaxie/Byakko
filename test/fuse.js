const {
    FuseBox,
    BabelPlugin,
    WebIndexPlugin,
} = require('fuse-box');
const { task } = require('fuse-box/sparky');

const initFuse = () => {
    const fuse = new FuseBox({
        homeDir: 'src',
        target: 'browser@es2017',
        output: 'dist/$name.js',
        useTypescriptCompiler: true,
        sourceMaps: true,
        alias: {
            react: 'preact/compat',
            'react-dom': 'preact/compat',
        },
        plugins: [
            WebIndexPlugin({
                title: 'Byakko Test',
                template: 'src/index.html',
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
        vendor: fuse.bundle('vendor').instructions('~ index.tsx'),
        app: fuse.bundle('app').instructions('> index.tsx'),
    };
};

task('build:watch', () => {
    const { vendor, app } = initFuse();

    app.fuse.dev({
        port: 3000,
        fallback: 'index.html',
    });

    vendor.watch();
    app.hmr().watch();
    return app.fuse.run();
});
