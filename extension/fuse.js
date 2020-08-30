const {
    FuseBox,
    BabelPlugin,
    SassPlugin,
    CSSPlugin,
} = require('fuse-box');
const { task } = require('fuse-box/sparky');

const initFuse = () => {
    const fuse = new FuseBox({
        homeDir: 'src',
        target: 'browser@es2017',
        output: 'dist/app/$name.js',
        useTypescriptCompiler: true,
        alias: {
            react: 'preact/compat',
            'react-dom': 'preact/compat',
        },
        plugins: [
            [
                SassPlugin({
                    outputStyle: 'compressed',
                }),
                CSSPlugin({
                    group: 'index.css',
                    outFile: `dist/app/index.css`,
                }),
            ],
            BabelPlugin({
                config: {
                    plugins: [['transform-react-jsx', { pragma: 'React.h' }]],
                },
            }),
        ],
    });

    return {
        fuse,
        vendor: fuse.bundle('vendor').instructions('~ index.tsx'),
        app: fuse.bundle('app').instructions('> index.tsx'),
    };
};

task('build', () => initFuse().fuse.run());

task('build:watch', ['build'], () => {
    const { vendor, app } = initFuse();

    vendor.watch();
    app.watch();

    return app.fuse.run();

});
