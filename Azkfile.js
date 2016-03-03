/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */
// Adds the systems that shape your system
systems({
    api: {
        // Dependent systems
        depends: [
            'redis',
            'mongodb',
            'mail',
            's3'
        ], // postgres, mysql, mongodb ...
        // More images:  http://images.azk.io
        // image: {'docker': 'azukiapp/node'},
        image: {'docker': 'movibe/loopback'},
        // image: {dockerfile: './'},
        // Steps to execute before running instances
        provision: [
            'npm install',
        ],
        workdir: '/azk/#{manifest.dir}',
        shell: '/bin/bash',
        command: 'npm start',
        wait: {
            'retry': 20,
            'timeout': 1000
        },
        mounts: {
            '/azk/#{manifest.dir}': path('.'),
        },
        scalable: {'default': 1},
        http: {
            // my-app.dev.azk.io
            domains: ['#{system.name}.#{azk.default_domain}']
        },
        ports: {
            http: '3000'
        },
        envs: {
            // set instances variables
            NODE_ENV: 'dev',
            PORT: '3000',
        },
    },
    mongodb: {
        image: {docker: 'azukiapp/mongodb'},
        scalable: false,
        wait: 20,
        // Mounts folders to assigned paths
        mounts: {
            // to keep data between the executions
            '/data/db': persistent('mongodb-#{manifest.dir}'),
        },
        ports: {
            http: '28017/tcp',
            data: '27017/tcp',
        },
        http: {
            // mongodb.azk.dev
            domains: ['#{manifest.dir}-#{system.name}.#{azk.default_domain}'],
        },
        export_envs: {
            MONGODB_URI: 'mongodb://#{net.host}:#{net.port.data}/#{manifest.dir}_development',
        },
    },

    redis: {
        image: 'redis',
        command: ["redis-server", "--appendonly", "yes"],
        scalable: false,
        ports: {
            data: '6379/tcp',
        },
        export_envs: {
            REDIS_URL: 'redis://#{net.host}:#{net.port.data}/#{manifest.dir}'
        },
        // Mounts folders to assigned paths
        mounts: {
            // equivalent persistent_folders
            '/data': persistent('data'), // Volume nomed
        },
    },

    // MailCatcher system
    mail: {
        // Dependent systems
        depends: [],
        // More images:  http://images.azk.io
        image: {'docker': 'schickling/mailcatcher'},
        http: {
            domains: [
                '#{system.name}.azkdemo.#{azk.default_domain}',
            ],
        },
        ports: {
            // exports global variables
            http: '1080/tcp',
            smtp: '1025/tcp',
        },
    },


    // MailCatcher system
    s3: {
        // Dependent systems
        depends: [],
        // More images:  http://images.azk.io
        image: '66pix/s3ninja',
        // Mounts folders to assigned paths
        mounts: {
            // equivalent persistent_folders
            '/opt/s3ninja/data/s3': persistent('storage'), // Volume nomed
        },
        http: {
            domains: [
                '#{system.name}.azkdemo.#{azk.default_domain}',
            ],
        },
        ports: {
            // exports global variables
            http: '9444/tcp'
        },
    },

  /*  // ngrok system
    ngrok: {
        // Dependent systems
        depends: ["azkdemo-services"],
        // More images:  http://images.azk.io
        image: {"docker": "azukiapp/ngrok:latest"},
        wait: {"retry": 20, "timeout": 1000},
        http: {
            domains: [
                "#{manifest.dir}-#{system.name}.#{azk.default_domain}",
            ],
        },
        ports: {
            // exports global variables
            http: "4040",
        },
        envs: {
            // set instances variables
            NGROK_CONFIG: "/ngrok/ngrok.yml",
            NGROK_LOG: "/ngrok/logs/ngrok.log",
        },
    },*/

});
