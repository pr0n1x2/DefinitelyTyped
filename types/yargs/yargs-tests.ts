/// <reference types="node" />

import yargs = require('yargs');
import yargsHelpers = require('yargs/helpers');
import yargsSingleton = require('yargs/yargs');

import * as fs from 'fs';
import * as path from 'path';
import { Arguments } from 'yargs';

const stringVal = 'string';

// Examples taken from yargs website
// https://github.com/chevex/yargs

// With yargs, the options be just a hash!
async function xup() {
    const argv = await yargs.parse();
    if (typeof argv.rif === "number" && typeof argv.xup === "number" && argv.rif - 5 * argv.xup > 7.138) {
        console.log('Plunder more riffiwobbles!');
    } else {
        console.log('Drop the xupptumblers!');
    }
}

// And non-hyphenated options too! Just use argv._!
function nonopt() {
    const argv = yargs.parseSync();
    console.log('(%d,%d)', argv.x, argv.y);
    console.log(argv._);
}

// Yargs even counts your booleans!
function count() {
    const argv = yargs
        .count('verbose')
        .alias('v', 'verbose')
        .parseSync();

    const VERBOSE_LEVEL: number = argv.verbose;

    function WARN() { VERBOSE_LEVEL >= 0 && console.log.apply(console, arguments); }
    function INFO() { VERBOSE_LEVEL >= 1 && console.log.apply(console, arguments); }
    function DEBUG() { VERBOSE_LEVEL >= 2 && console.log.apply(console, arguments); }
}

// Tell users how to use yer options and make demands.
function divide() {
    const argv = yargs
        .usage('Usage: $0 -x [num] -y [num]')
        .demand(['x', 'y'])
        .number(['x', 'y'])
        .parseSync();

    console.log(argv.x / argv.y);
}

// After yer demands have been met, demand more! Ask for non-hypenated arguments!
function demand_count() {
    const argv = yargs
        .demand(2)
        .demand(2, false)
        .demand(2, 2)
        .demand(2, 2, "message")
        .argv;
    console.dir(argv);
}

// EVEN MORE SHIVER ME TIMBERS!
function default_singles() {
    const argv = yargs
        .default('x', 10)
        .default('y', 10)
        .parseSync();
    console.log(argv.x + argv.y);
}

function default_hash() {
    const argv = yargs
        .default({ x: 10, y: 10 })
        .parseSync();
    console.log(argv.x + argv.y);
}

// And if you really want to get all descriptive about it...
function boolean_single() {
    const argv = yargs
        .boolean('v')
        .parseSync();
    console.dir(argv.v);
    console.dir(argv._);
}

function boolean_double() {
    const argv = yargs
        .boolean(['x', 'y', 'z'])
        .parseSync();
    console.dir([argv.x, argv.y, argv.z]);
    console.dir(argv._);
}

// Yargs is here to help you...
function line_count() {
    const argv = yargs
        .usage('Count the lines in a file.\nUsage: $0')
        .example('$0 -f', 'count the lines in the given file')
        .demand('f')
        .alias('f', 'file')
        .describe('f', 'Load a file')
        .argv;
}

// ts4.2+ types only
function camelCase() {
    const args: Arguments<{ someOpt: number }> = yargs
    .usage('Usage: $0 options')
    .describe('some-opt', 'Some option')
    .default('some-opt', 2)
    .parseSync();

    yargs
    .command(
        'my-command',
        'a command',
        { 'some-opt-in-command': { describe: 'Some option', default: 2 } },
        (args: Arguments<{ someOptInCommand: number }>) => {}
    );
}

// Below are tests for individual methods.
// Not all methods are covered yet, and neither are all possible invocations of methods.

async function Argv$argv() {
    const argv = await yargs.parse();
    console.log("command name: " + argv.$0);
    console.log("command: " + argv._[1]);
}

async function Argv$parsing() {
    const argv1 = await yargs.parse();
    const argv2 = yargs(['-x', '1', '-y', '2']).parseSync();
    const argv3 = yargs.parseSync(['-x', '1', '-y', '2']);
    const argv4 = await yargs(['-x', '1', '-y', '2']).parseAsync();
    console.log(argv1.x, argv2.x, argv3.x, argv4.x);

    // $ExpectType Argv<{}>
    yargs();

    // $ExpectType { [x: string]: unknown; _: (string | number)[]; $0: string; } | Promise<{ [x: string]: unknown; _: (string | number)[]; $0: string; }>
    yargs.parse();

    // $ExpectType { [x: string]: unknown; _: (string | number)[]; $0: string; } | Promise<{ [x: string]: unknown; _: (string | number)[]; $0: string; }>
    yargs([]).argv;

    // $ExpectType { [x: string]: unknown; _: (string | number)[]; $0: string; } | Promise<{ [x: string]: unknown; _: (string | number)[]; $0: string; }>
    yargs.argv;

    // $ExpectType { [x: string]: unknown; _: (string | number)[]; $0: string; } | Promise<{ [x: string]: unknown; _: (string | number)[]; $0: string; }>
    yargs().argv;

    // $ExpectType { [x: string]: unknown; update: boolean | undefined; extern: boolean | undefined; _: (string | number)[]; $0: string; }
    yargs(['--update'])
        .boolean('update')
        .boolean('extern')
        .parseSync();
}

function Argv$options() {
    const argv1 = yargs
        .options('f', {
            alias: 'file',
            default: '/etc/passwd',
            defaultDescription: 'The /etc/passwd file',
            group: 'files',
            normalize: true,
            global: false,
            array: true,
            nargs: 3,
            implies: 'other-arg',
            conflicts: 'conflicting-arg',
        })
        .argv
        ;

    const argv2 = yargs
        .alias('f', 'file')
        .default('f', '/etc/passwd')
        .argv
        ;
}

function Argv$global() {
    const argv = yargs
        .global('foo')
        .global(['bar', 'baz', 'fizz', 'buzz']);
}

function Argv$group() {
    const argv = yargs
        .group('foo', 'foogroup')
        .group(['bing', 'bang', 'buzz'], 'onomatopoeia');
}

function Argv$env() {
    const argv = yargs
        .env('YARGS_PREFIX_')
        .env()
        .env(true);
}

function Argv$array() {
    const argv = yargs
        .array('foo')
        .array(['bar', 'baz']);
}

function Argv$nargs() {
    const argv = yargs
        .nargs('foo', 12)
        .nargs({ bing: 3, bang: 2, buzz: 4 });
}

function Argv$choices() {
    // example from documentation
    const argv = yargs
        .alias('i', 'ingredient')
        .describe('i', 'choose your sandwich ingredients')
        .choices('i', ['peanut-butter', 'jelly', 'banana', 'pickles'])
        .help('help')
        .argv;

    yargs
        .choices('i', [undefined, true, 'asdf', 'test'])
        .choices({
            test: [undefined, true, 'test-value']
        });
}

function Argv$usage_as_default_command() {
    const argv = yargs
        .usage(
            "$0 get",
            'make a get HTTP request',
            (yargs) => {
                return yargs.option('u', {
                    alias: 'url',
                    describe: 'the URL to make an HTTP request to'
                });
            },
            (argv) => {
                console.dir(argv.url);
            }
        )
        .argv;
}

function Argv$command() {
    const argv = yargs
        .usage('npm <command>')
        .command('install', 'tis a mighty fine package to install')
        .command('publish', 'shiver me timbers, should you be sharing all that', yargs =>
            yargs.option('f', {
                alias: 'force',
                description: 'yar, it usually be a bad idea'
            })
                .help('help')
        )
        .command("build", "arghh, build it mate", {
            tag: {
                default: true,
                demand: true,
                description: "Tag the build, mate!"
            },
            publish: {
                default: false,
                description: "Should i publish?"
            }
        })
        .command({
            command: "test",
            describe: "test package",
            builder: {
                mateys: {
                    demand: false
                }
            },
            deprecated: false,
            handler: (args: any) => {
                /* handle me mateys! */
            }
        })
        .command("test", "test mateys", {
            handler: (args: any) => {
                /* handle me mateys! */
            }
        })
        .help('help')
        .argv;

    yargs
        .command('get', 'make a get HTTP request', (yargs) => {
            return yargs.option('url', {
                alias: 'u',
                default: 'http://yargs.js.org/'
            });
        })
        .help()
        .argv;

    yargs
        .command(
            'get',
            'make a get HTTP request',
            (yargs) => {
                return yargs.option('u', {
                    alias: 'url',
                    describe: 'the URL to make an HTTP request to'
                });
            },
            (argv) => {
                console.dir(argv.url);
            },
            // middlewares
            [],
            // deprecated
            'use --newGet'
        )
        .help()
        .argv;

    yargs
        .command('get <source> [proxy]', 'make a get HTTP request', yargs => {
            yargs.positional('source', {
                describe: 'URL to fetch content from',
                type: 'string',
                default: 'http://www.google.com'
            }).positional('proxy', {
                describe: 'optional proxy URL'
            });
        })
        .help()
        .argv;
}

function Argv$example() {
    yargs
        .command({
            command: 'get',
            handler: () => {
                // command
            },
        })
        .command({
            command: 'post',
            handler: () => {
                // command
            },
        })
        .command({
            command: 'delete',
            handler: () => {
                // command
            },
        })
        .example([
            ['$0 get', 'get https://example.com/'],
            ['$0 post', 'post https://example.com/'],
        ])
        .example('$0 delete', 'delete https://example.com').argv;
}

function Argv$positional() {
    const module: yargs.CommandModule<{}, { paths: string[] }> = {
        command: 'test <paths...>',
        builder(yargs) {
            return yargs.positional('paths', {
                type: 'string',
                array: true,
                demandOption: true
            });
        },
        handler(argv) {
            argv.paths.map((path) => path);
        }
    };
}

async function Argv$commandModule() {
    class CommandOne implements yargs.CommandModule {
        handler(args: yargs.Arguments): void {
            console.log("one");
        }
        deprecated: true;
    }

    const CommandTwo: yargs.CommandModule<{ a: string }, { b: number }> = {
        builder: async yargs => {
            // $ExpectType: string
            (await yargs.argv).a;
            return yargs.number("b").default("b", parseInt((await yargs.argv).a, 10));
        },

        handler: argv => {
            // $ExpectType: number
            argv.b;
        }
    };

    class Configure implements yargs.CommandModule<{ verbose: boolean }, { verbose: boolean, key: string, value: boolean }> {
        command = 'configure <key> [value]';
        aliases = ['config', 'cfg'];
        describe = 'Set a config variable';

        builder(yargs: yargs.Argv<{ verbose: boolean }>) {
            return yargs.positional('key', { default: '' }).positional('value', { default: true });
        }

        handler(argv: yargs.Arguments<{ verbose: boolean, key: string, value: string | boolean }>) {
            if (argv.verbose) {
                console.log(`setting ${argv.key} to ${argv.value}`);
            }
        }
    }

    const Configure2: yargs.CommandModule<{ verbose: boolean }, { verbose: boolean, key: string, value: boolean }> = {
        command: 'configure <key> [value]',
        aliases: ['config', 'cfg'],
        describe: 'Set a config variable',

        builder: yargs => {
            return yargs.positional('key', { default: '' }).positional('value', { default: true });
        },

        handler: argv => {
            if (argv.verbose) {
                console.log(`setting ${argv.key} to ${argv.value}`);
            }
        }
    };

    const command = 'import-file <file>';
    const describe = 'run the importer on a single file';
    const builder = (yargs: yargs.Argv) => {
        return yargs
            .positional('file', {
                describe: 'path to file to import'
            })
            .options({
                cleanDestination: {
                    boolean: true,
                    describe: 'Clean the destination folder from previously generated files before proceeding.'
                }
            });
    };

    const commandArgs = builder(yargs).argv;

    // $ExpectType: { [x: string]: unknown; file: unknown; cleanDestination: boolean | undefined; _: (string | number)[]; $0: string; }
    commandArgs;

    // Backwards compatibility with older types
    const builder2: yargs.CommandBuilder = builder;
    const commandArgs2: yargs.Arguments = await builder(yargs).argv;
    const commandArgs3: yargs.Arguments = await builder2(yargs).argv;
}

function Argv$completion_hide() {
    // no func
    yargs.completion('completion', false).argv;

    // sync func
    yargs.completion('complation', false, (current, argv) => {
        // 'current' is the current command being completed.
        // 'argv' is the parsed arguments so far.
        // simply return an array of completions.
        return ['foo', 'bar'];
    }).argv;

    // async func
    yargs.completion('complation', false, (current: string, argv: any, done: (completion: string[]) => void) => {
        setTimeout(() => {
            done(['apple', 'banana']);
        }, 500);
    }).argv;

    // promise func
    yargs.completion('complation', false, (current: string, argv: any) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(['apple', 'banana']);
            }, 10);
        });
    }).argv;
}

function Argv$completion_sync() {
    const argv = yargs
        .completion('completion', (current, argv) => {
            // 'current' is the current command being completed.
            // 'argv' is the parsed arguments so far.
            // simply return an array of completions.
            return [
                'foo',
                'bar'
            ];
        })
        .argv;
}

function Argv$completion_async() {
    const argv = yargs
        .completion('completion', (current: string, argv: any, done: (completion: string[]) => void) => {
            setTimeout(() => {
                done([
                    'apple',
                    'banana'
                ]);
            }, 500);
        })
        .argv;
}

function Argv$completion_promise() {
    const argv = yargs
        .completion('completion', (current: string, argv: any) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(['apple', 'banana']);
                }, 10);
            });
        })
        .argv;
}

function Argv$help() {
    const argv = yargs
        .usage("$0 -operand1 number -operand2 number -operation [add|subtract]")
        .help()
        .argv;
}

function Argv$showHelpOnFail() {
    const argv = yargs
        .usage('Count the lines in a file.\nUsage: $0')
        .demand('f')
        .alias('f', 'file')
        .describe('f', 'Load a file')
        .showHelpOnFail(false, "Specify --help for available options")
        .argv;
}

function Argv$showHelp() {
    const yargs1 = yargs
        .usage("$0 -operand1 number -operand2 number -operation [add|subtract]");
    yargs1.showHelp();
}

function Argv$showHelpWithCallback() {
    const yargs1 = yargs.option('test', {
        describe: "it's a test"
    });
    yargs1.showHelp(s => console.log(`Help! ${s}`));
}

function Argv$version() {
    const argv1 = yargs
        .version();

    const argv2 = yargs
        .version('1.0.0');

    const argv3 = yargs
        .version('--version', '1.0.0');

    const argv4 = yargs
        .version('--version', 'Show version', '1.0.0');

    const argv5 = yargs
        .version(false);
}

function Argv$showVersion() {
    const argv1 = yargs
        .showVersion();

    const argv2 = yargs
        .showVersion('error');

    const argv3 = yargs
        .showVersion('log');

    const argv4 = yargs
        .showVersion(s => console.log(`Thar be a version! ${s}`));
}

function Argv$wrap() {
    const argv1 = yargs
        .wrap(null);

    const argv2 = yargs
        .wrap(yargs.terminalWidth());
}

function Argv$locale() {
    const argv = yargs
        .usage('./$0 - follow ye instructions true')
        .option('option', {
            alias: 'o',
            describe: "'tis a mighty fine option",
            demand: true
        })
        .command('run', "Arrr, ya best be knowin' what yer doin'")
        .example('$0 run foo', "shiver me timbers, here's an example for ye")
        .help('help')
        .wrap(70)
        .locale('pirate')
        .argv;
}

function Argv$middleware() {
    const mwFunc1 = (argv: Arguments) => console.log(`I'm a middleware function`, argv);
    const mwFunc2 = (argv: Arguments) => console.log(`I'm another middleware function`, argv);
    const mwFunc3 = async (argv: Arguments) => console.log(`I'm another middleware function`, argv);

    const argv = yargs
        .middleware([mwFunc1, mwFunc2, mwFunc3])
        .middleware((argv) => {
            if (process.env.HOME) argv.home = process.env.HOME;
        }, true)
        .argv;
}

function Argv$epilogue() {
    const argv = yargs
        .epilogue('for more information, find our manual at http://example.com');
}

// http://yargs.js.org/docs/#methods-commanddirdirectory-opts
function Argv$commandDir() {
    const ya = yargs
        .commandDir('.')
        .argv;
}

// http://yargs.js.org/docs/#methods-commanddirdirectory-opts
function Argv$commandDirWithOptions() {
    const ya = yargs
        .commandDir('.', {
            recurse: false,
            extensions: ['js'],
            visit: (commandObject: any, pathToFile?: string, filename?: string) => void 0,
            include: /.*\.js$/,
            exclude: /.*\.spec.js$/,
        })
        .argv;
}

function Argv$normalize() {
    const ya = yargs
        .normalize('path')
        .normalize(['user', 'group'])
        .argv;
}

// From http://yargs.js.org/docs/#methods-coercekey-fn
function Argv$coerce() {
    const ya = yargs
        .coerce('file', (arg: string) => {
            return fs.readFileSync(arg, 'utf8');
        })
        .argv;
}
function Argv$coerces() {
    const ya = yargs
        .coerce({
            date: Date.parse,
            json: JSON.parse
        })
        .argv;
}
function Argv$coerceWithKeys() {
    const ya = yargs
        .coerce(['src', 'dest'], path.resolve)
        .argv;
}

// From http://yargs.js.org/docs/#methods-failfn
function Argv$fail() {
    const ya = yargs
        .fail((msg, err, { help }) => {
            if (err) throw err; // preserve stack
            console.error('You broke it!');
            console.error(msg);
            console.error(help());
            process.exit(1);
        })
        .argv;

    // Providing false as a value for fn can be used to prevent yargs from
    // exiting and printing a failure message
    const ya2 = yargs
        .fail(false)
        .argv;
}

function Argv$implies() {
    const ya = yargs
        .implies('foo', 'snuh')
        .implies({
            x: 'y'
        })
        .argv;
}

function Argv$count() {
    const ya = yargs
        .count('size')
        .count(['w', 'h'])
        .argv;
}

function Argv$number() {
    const ya = yargs
        .number('n')
        .number(['width', 'height'])
        .argv;
}

function Argv$updateStrings() {
    const ya = yargs
        .command('run', 'the run command')
        .help('help')
        .updateStrings({
            'Commands:': 'My Commands -->\n'
        })
        .wrap(null)
        .argv;
}

function Argv$default() {
    const ya = yargs
        .default('random', function randomValue() {
            return Math.random() * 256;
        })
        .argv;
}

function Argv$configObject() {
    const ya = yargs
        .config({ foo: 1, bar: 2 })
        .argv;
}

function Argv$configParseFunction() {
    const ya = yargs
        .config('settings', (configPath) => {
            return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        })
        .config('settings', 'description', (configPath) => {
            return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        })
        .argv;
}

function Argv$helpDescriptionExplicit() {
    const ya = yargs
        .help('help', 'description', true)
        .argv;
}

function Argv$showHelpConsoleLevel() {
    yargs.showHelp("log"); // prints to stdout using console.log()
}

function Argv$getCompletion() {
    const ya = yargs
        .option('foobar', {})
        .option('foobaz', {})
        .completion()
        .getCompletion(['./test.js', '--foo'], (completions) => {
            console.log(completions);
        })
        .argv;
}

function Argv$getHelp() {
	const ya = yargs.getHelp().then((help: string) => {
            console.log(help);
		});
}

function Argv$parserConfiguration() {
    const argv1 = yargs.parserConfiguration({
        'boolean-negation': false,
        'camel-case-expansion': false,
        'combine-arrays': false,
        'dot-notation': false,
        'duplicate-arguments-array': false,
        'flatten-duplicate-arrays': false,
        'halt-at-non-option': true,
        'negation-prefix': 'non-',
        'parse-numbers': false,
        'populate--': false,
        'set-placeholder-key': false,
        'short-option-groups': false,
        'sort-commands': true,
    }).parse();

    const argv2 = yargs.parserConfiguration({
        'negation-prefix': 'nope-',
    }).parse();
}

function Argv$pkgConf() {
    const ya = yargs
        .pkgConf(['key1', 'key2'], 'configFile.json')
        .argv;
}

function Argv$recommendCommands() {
    const ya = yargs
        .recommendCommands()
        .argv;
}

function Argv$showCompletionScript() {
    const ya = yargs
        .showCompletionScript()
        .argv;
}

function Argv$skipValidation() {
    const ya = yargs
        .skipValidation('arg1')
        .skipValidation(['arg2', 'arg3'])
        .argv;
}

function Argv$commandObject() {
    const options: yargs.Options = {
        alias: "string",
        array: true,
        boolean: true,
        choices: [undefined, true, "a", "b", "c"],
        coerce: f => JSON.stringify(f),
        config: true,
        configParser: t => JSON.parse(fs.readFileSync(t, "utf8")),
        count: true,
        default: "myvalue",
        defaultDescription: "description",
        demand: true,
        demandOption: true,
        deprecate: true,
        deprecated: "deprecated",
        desc: "desc",
        describe: "describe",
        description: "description",
        global: false,
        group: "group",
        nargs: 1,
        normalize: false,
        number: true,
        requiresArg: true,
        skipValidation: false,
        string: true,
        type: "string"
    };
    const ya = yargs.command("commandname", "description", { arg: options });
}

function Argv$demandCommand() {
    const ya = yargs
        .demandCommand(1)
        .demandCommand(1, 'at least 1 command required')
        .demandCommand(1, 2)
        .demandCommand(1, 2, 'at least 1 command required')
        .demandCommand(1, 2, 'at least 1 command required', 'at most 2 commands required')
        .argv;
}

function Argv$demandOption() {
    const ya = yargs
        .demandOption('a')
        .demandOption('a', 'a is required')
        .demandOption('a', true)
        .demandOption(['a', 'b'])
        .demandOption(['a', 'b'], 'a and b are required')
        .demandOption(['a', 'b'], true)
        .argv;
}

function Argv$deprecateOption() {
    const ya = yargs
        .option('old', {})
        .deprecateOption('old', 'use --new')
        .option('new', {})
        .argv;
}

function Argv$conflicts() {
    const ya = yargs
        .conflicts('a', 'b')
        .conflicts({
            a: 'b'
        })
        .argv;
}

function Argv$commandArray() {
    const ya = yargs
        .command(['commandName', 'commandAlias'], 'command description')
        .argv;
}

function Argv$check() {
    const ya = yargs
        .check((argv, aliases) => void 0)
        .check((argv, aliases) => void 0, false);
}

function Argv$hide() {
    const ya = yargs
        .hide('a');
}

function Argv$showHidden() {
    const ya = yargs
        .showHidden()
        .showHidden(true)
        .showHidden('show-hidden')
        .showHidden('show-hidden', 'Show hidden options');
}

function Argv$scriptName() {
    const ya = yargs
        .scriptName("my-script");
}

type Color = "red" | "blue" | "green";
const colors: ReadonlyArray<Color> = ["red", "blue", "green"];

type Stage = 1 | 2 | 3 | 4;
const stages: ReadonlyArray<Stage> = [1, 2, 3, 4];

async function Argv$inferOptionTypes() {
    // $ExpectType { [x: string]: unknown; a: (string | number)[] | undefined; b: boolean | undefined; c: number; n: number | undefined; s: string | undefined; _: (string | number)[]; $0: string; }
    await yargs
        .option("a", { type: "array" })
        .option("b", { type: "boolean" })
        .option("c", { type: "count" })
        .option("n", { type: "number" })
        .option("s", { type: "string" })
        .parseAsync();

    // $ExpectType { [x: string]: unknown; a: number; b: boolean; c: string; _: (string | number)[]; $0: string; }
    yargs
        .option("a", { default: 42 })
        .option("b", { default: false })
        .option("c", { default: "tmp" })
        .parseSync();

    // $ExpectType { [x: string]: unknown; a: (string | number)[] | undefined; b: boolean | undefined; n: number | undefined; s: string | undefined; _: (string | number)[]; $0: string; }
    await yargs
        .option("a", { array: true })
        .option("b", { boolean: true })
        .option("n", { number: true })
        .option("s", { string: true })
        .parseAsync();

    // $ExpectType { [x: string]: unknown; choices: Color; numberChoices: Stage; coerce: Date | undefined; count: number; normalize: string | undefined; _: (string | number)[]; $0: string; }
    yargs
        .option("choices", { choices: colors, required: true })
        .option("numberChoices", { choices: stages, demandOption: true })
        .option("coerce", { coerce: () => new Date() })
        .option("count", { count: true })
        .option("normalize", { normalize: true })
        .parseSync();

    // $ExpectType (string | number)[] | undefined
    (await yargs.array("x").argv).x;

    // $ExpectType boolean | undefined
    (await yargs.boolean("x").argv).x;

    // $ExpectType "red" | "blue" | "green" | undefined || Color | undefined
    yargs.choices("x", colors).parseSync().x;

    // $ExpectType number | undefined
    yargs.choices('x', [1, 2, 3, 4]).parseSync().x;

    // $ExpectType number | undefined
    (await yargs.coerce("x", Date.parse).argv).x;

    // $ExpectType number
    yargs.count("x").parseSync().x;

    // $ExpectType Date
    yargs.default("x", new Date()).parseSync().x;

    // $ExpectType string | undefined
    (await yargs.normalize("x").argv).x;

    // $ExpectType number | undefined
    (await yargs.number("x").argv).x;

    // $ExpectType string | undefined
    yargs.string("x").parseSync().x;
}

function Argv$inferRequiredOptionTypes() {
    // $ExpectType string
    yargs.string("x").demand("x").parseSync().x;

    // $ExpectType string
    yargs.demand("x").string("x").parseSync().x;

    // $ExpectType string
    yargs.string("x").demandOption("x").parseSync().x;

    // $ExpectType string | undefined
    yargs.string("x").demandOption("x", false).parseSync().x;

    // $ExpectType { [x: string]: unknown; x: string; y: number; _: (string | number)[]; $0: string; }
    yargs.string("x").number("y").demandOption(["x", "y"]).parseSync();

    // $ExpectType { [x: string]: unknown; x: string; y: number; _: (string | number)[]; $0: string; }
    yargs.string("x").number("y").demandOption(["x", "y"], true).parseSync();

    // $ExpectType { [x: string]: unknown; x: string | undefined; y: number | undefined; _: (string | number)[]; $0: string; }
    yargs.string("x").number("y").demandOption(["x", "y"], false).parseSync();

    // $ExpectType { [x: string]: unknown; x: string; y: number; _: (string | number)[]; $0: string; }
    yargs.demandOption(["x", "y"]).string("x").number("y").parseSync();

    // $ExpectType { [x: string]: unknown; x: string; y: number; _: (string | number)[]; $0: string; }
    yargs.demandOption(["x", "y"], true).string("x").number("y").parseSync();

    // $ExpectType { [x: string]: unknown; x: string | undefined; y: number | undefined; _: (string | number)[]; $0: string; }
    yargs.demandOption(["x", "y"], false).string("x").number("y").parseSync();

    // $ExpectType string
    yargs.option("x", { string: true, require: true }).parseSync().x;

    // $ExpectType string
    yargs.option("x", { string: true, required: true }).parseSync().x;

    // $ExpectType string
    yargs.option("x", { string: true, demand: true }).parseSync().x;

    // $ExpectType string
    yargs.option("x", { string: true, demandOption: true }).parseSync().x;

    // $ExpectType string | undefined
    yargs.option("x", { string: true, demandOption: false }).parseSync().x;

    // $ExpectType number
    yargs.option("x", { count: true }).parseSync().x;

    // $ExpectType number
    yargs.option("x", { number: true, default: 42 }).parseSync().x;

    // $ExpectType (string | number)[]
    yargs.option("x", { array: true, demandOption: true }).parseSync().x;

    // $ExpectType string
    yargs.option("x", { default: "default" as string | undefined, demandOption: true }).parseSync().x;

    // $ExpectType string
    yargs.option("x", { default: "default" as string | undefined, demand: true }).parseSync().x;

    // $ExpectType string
    yargs.option("x", { default: "default" as string | undefined, require: true }).parseSync().x;

    // $ExpectType string
    yargs.option("x", { default: "default" as string | undefined, required: true }).parseSync().x;
}

function Argv$inferMultipleOptionTypes() {
    // tslint:disable-next-line
    // $ExpectType { [x: string]: unknown; a: string; b: boolean; c: number; d: number; e: number; _: (string | number)[]; $0: string; } || { [x: string]: unknown; b: boolean; a: string; d: number; e: number; c: number; _: (string | number)[]; $0: string; }
    yargs
        .option({ a: { default: "a" }, b: { default: false } })
        .number(["c", "d", "e"])
        .demandOption(["c", "d", "e"])
        .parseSync();

    // tslint:disable-next-line
    // $ExpectType { [x: string]: unknown; a: string; b: boolean; c: number; d: number; e: number; _: (string | number)[]; $0: string; } || { [x: string]: unknown; b: boolean; a: string; d: number; e: number; c: number; _: (string | number)[]; $0: string; }
    yargs
        .options({ a: { default: "a" }, b: { default: false } })
        .number(["c", "d", "e"])
        .demandOption(["c", "d", "e"])
        .parseSync();

    // tslint:disable-next-line
    // $ExpectType { [x: string]: unknown; a: number; b: string; c: boolean; _: (string | number)[]; $0: string; } || { [x: string]: unknown; b: string; a: number; c: Date; _: (string | number)[]; $0: string; }
    yargs
        .default({ a: 42, b: "b", c: false })
        .parseSync();

    // tslint:disable-next-line
    // $ExpectType { [x: string]: unknown; a: number; b: string; c: Date; _: (string | number)[]; $0: string; } || { [x: string]: unknown; b: string; a: number; c: Date; _: (string | number)[]; $0: string; }
    yargs
        .coerce({ a: Date.parse, b: String.prototype.toLowerCase, c: (s: string) => new Date(s) })
        .demandOption(["a", "b", "c"])
        .parseSync();

    // $ExpectType { [x: string]: unknown; a: number; b: string[]; _: (string | number)[]; $0: string; }
    yargs
        .options({
            a: {
                type: 'number',
                default: 4
            },
            b: {
                coerce: (arg: string) => arg.split(','),
                default: 'one,two,three'
            }
        })
        .parseSync();

    // tslint:disable-next-line
    // $ExpectType { [x: string]: unknown; a: number | undefined; b: string | undefined; c: Color; _: (string | number)[]; $0: string; } || { [x: string]: unknown; b: string | undefined; a: number | undefined; c: Color; _: (string | number)[]; $0: string; }
    yargs
        .choices({ a: [1, 2, 3], b: ["black", "white"], c: colors })
        .demandOption("c")
        .parseSync();
}

function Argv$inferOptionTypesForAliases() {
    // $ExpectType { [x: string]: unknown; u: string | undefined; url: string | undefined; _: (string | number)[]; $0: string; }
    yargs
        .option("u", { type: "string" })
        .alias("u", "url")
        .parseSync();

    // tslint:disable-next-line
    // $ExpectType { [x: string]: unknown; v: boolean; loud: boolean; noisy: boolean; verbose: boolean; n: boolean; _: (string | number)[]; $0: string; } || { [x: string]: unknown; v: boolean; verbose: boolean; loud: boolean; noisy: boolean; n: boolean; _: (string | number)[]; $0: string; }
    yargs
        .option("v", { default: false })
        .alias("v", ["loud", "noisy", "verbose"])
        .alias("n", "noisy")
        .parseSync();

    // $ExpectType { [x: string]: unknown; n: number; count: number; num: number; _: (string | number)[]; $0: string; }
    yargs
        .option("n", { number: true, demandOption: true })
        .alias("n", "count")
        .alias("num", ["n", "count"])
        .parseSync();
}

async function Argv$inferArrayOptionTypes() {
    // $ExpectType (string | number)[]
    (await yargs.option("a", { array: true, demandOption: true }).argv).a;

    // $ExpectType string[]
    (await yargs.option("a", { array: true, string: true, demandOption: true }).parseAsync()).a;

    // $ExpectType number[]
    yargs.option("a", { array: true, number: true, demandOption: true }).parseSync().a;

    // $ExpectType string[]
    yargs.option("a", { array: true, normalize: true, demandOption: true }).parseSync().a;

    // $ExpectType string[] | undefined
    yargs.option("a", { array: true, type: "string" }).parseSync().a;

    // $ExpectType number[] | undefined
    yargs.option("a", { array: true, type: "number" }).parseSync().a;

    // $ExpectType string[] | undefined
    yargs.option("a", { array: true, normalize: true }).parseSync().a;

    // $ExpectType string[] | undefined
    yargs.option("a", { string: true, type: "array" }).parseSync().a;

    // $ExpectType number[] | undefined
    yargs.option("a", { number: true, type: "array" }).parseSync().a;

    // $ExpectType string[] | undefined
    yargs.option("a", { normalize: true, type: "array" }).parseSync().a;

    // $ExpectType string[] | undefined || ToArray<string | undefined>
    yargs.string("a").array("a").parseSync().a;

    // $ExpectType string[] | undefined || ToString<(string | number)[] | undefined>
    yargs.array("a").string("a").parseSync().a;

    // $ExpectType string[]
    yargs.string("a").array("a").demandOption("a").parseSync().a;

    // $ExpectType string[]
    yargs.array("a").string("a").demandOption("a").parseSync().a;

    // $ExpectType string[]
    yargs.string("a").demandOption("a").array("a").parseSync().a;

    // $ExpectType string[]
    yargs.array("a").demandOption("a").string("a").parseSync().a;

    // $ExpectType number[]
    yargs.number("a").array("a").demandOption("a").parseSync().a;

    // $ExpectType number[]
    yargs.array("a").number("a").demandOption("a").parseSync().a;

    // $ExpectType number[]
    yargs.array("a").demandOption("a").number("a").parseSync().a;

    // $ExpectType string[]
    yargs.normalize("a").array("a").demandOption("a").parseSync().a;

    // $ExpectType string[]
    yargs.array("a").normalize("a").demandOption("a").parseSync().a;

    // $ExpectType string[]
    yargs.array("a").demandOption("a").normalize("a").parseSync().a;
}

function Argv$inferRepeatedOptionTypes() {
    // $ExpectType boolean | undefined
    yargs.string("a").boolean("a").parseSync().a;

    // $ExpectType string | undefined || ToString<number | undefined>
    yargs.number("a").string("a").parseSync().a;

    // $ExpectType number | undefined || ToNumber<string | undefined>
    yargs.string("a").number("a").parseSync().a;

    // $ExpectType boolean | undefined
    yargs.string("a").option("a", { number: true }).boolean("a").parseSync().a;

    // $ExpectType boolean | undefined
    yargs.number("a").option("a", { string: true }).boolean("a").parseSync().a;

    // $ExpectType string | undefined
    yargs.boolean("a").option("a", { number: true }).option("a", { string: true }).parseSync().a;

    // $ExpectType number | undefined
    yargs.boolean("a").option("a", { string: true }).option("a", { number: true }).parseSync().a;
}

async function Argv$fallbackToUnknownForUnknownOptions() {
    // $ExpectType unknown
    (await yargs.argv).bogus;

    // $ExpectType unknown
    yargs
        .option({ a: { type: "string" }, b: { type: "boolean" } })
        .parseSync()
        .bogus;

    const argv = await yargs.option({ a: {}, b: {} }).option("c", {}).argv;
    // $ExpectType unknown
    argv.a;
    // $ExpectType unknown
    argv.b;
    // $ExpectType unknown
    argv.c;

    // @ts-expect-error
    const x: string = (await yargs.argv).x;
    return x;
}

function Argv$exit() {
    yargs.exit(1, new Error("oh no"));
}

function Argv$parsed() {
    const parsedArgs = yargs.parsed;
}

async function Argv$defaultCommandWithPositional(): Promise<string> {
    const argv = yargs.command(
        "$0 <arg>",
        "default command",
        (yargs) =>
            yargs.positional("arg", {
                demandOption: true,
                describe: "argument",
                type: "string",
            }),
        () => { }).argv;

    return (await argv).arg;
}

function Argv$commandsWithAsynchronousBuilders() {
    const argv1 = yargs.command(
        "command <arg>",
        "some command",
        (yargs) =>
            Promise.resolve(
                yargs.positional("arg", {
                    demandOption: true,
                    describe: "argument",
                    type: "string",
                })),
        () => { }).parseSync();

    const arg1: string = argv1.arg;

    const argv2 = yargs.command({
        command: "command <arg>",
        describe: "some command",
        builder: (yargs) =>
            Promise.resolve(
                yargs.positional("arg", {
                    demandOption: true,
                    describe: "argument",
                    type: "string",
                })),
        handler: () => {}
    }).parseSync();

    const arg2: string = argv2.arg;
}

const wait = (n: number) => new Promise(resolve => setTimeout(resolve, n));
async function Argv$commandWithAsynchronousHandler() {
    await yargs
        .command(
            'command <arg>',
            'some command',
            yargs => yargs,
            async args => {
                await wait(0);
                console.log('one');
            },
        )
        .parseAsync();
}

function makeSingleton() {
    yargsSingleton(process.argv.slice(2));
}

function Argv$strictOptions() {
    // test taken from https://github.com/yargs/yargs/blob/master/test/validation.cjs#L1036
    const argv1 = yargs
    .command('foo', 'foo command')
    .option('a', {
        describe: 'a is for option'
    })
    .strictOptions()
    .argv;
}

function Argv$strictCommands() {
    const argv1 = yargs.strictCommands().command('foo', 'foo command').argv;
    const argv2 = yargs.strictCommands(true).command('foo', 'foo command').argv;
}

function Argv$applyExtendsHelper() {
    // $ExpectType Record<string, any>
    const arvg = yargsHelpers.applyExtends(
        { extends: './package.json', apple: 'red' },
        process.cwd(),
        true
    );
}

function Argv$hideBinHelper() {
    // $ExpectType string[]
    const arvg = yargsHelpers.hideBin(process.argv);
}

function Argv$ParserHelper() {
    // $ExpectType Arguments
    const argv = yargsHelpers.Parser('--foo --bar=99');
}
