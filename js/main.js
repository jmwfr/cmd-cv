$('document').ready(function() {
    $('#console').terminal(function(command) {

        if (command !== '') {
            try {
                var parsedCmd = $.terminal.parse_command(command); 
                var cmdName = parsedCmd.name;
                var argsArray = Array.from(parsedCmd.args);
                executeCommand(this,cmdName,argsArray);
            } catch(e) {    
                this.error(new String(e));
            }
        } else {
           this.echo('Please enter a valid command...');
        }
    }, {
        greetings: '---------------------------------------------------\n|             ___  ______  ________  _________    |\n|            /  / /      |/       / /  ___   |    |\n|     ___   /  / /   /\\     /\\   / /  /___|  |    |\n|    /  /__/  / /   /  \\___/ /  / /  _____   |    |\n|   /________/ /___/        /__/ /__/     |__|    |\n|                                                 |\n|    Curriculum vitae - v: 1.0.0 - 20/06/2019     |\n|_________________________________________________|\n\nBienvenue sur mon cv en ligne de commande !\nType "help" for more commands\n',
        name: 'cv_jma',
        height: 200,
        prompt: 'root@jma-cv> '
    });

    var executeCommand = function(terminal, cmd, args) {
        terminal.echo('Executing command: ' + cmd + "\nWith args: " + args);
    }
});