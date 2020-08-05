$('document').ready(function () {
    $('#console').terminal(function (command) {
        if (command !== '') {
            try {
                var parsedCmd = $.terminal.parse_command(command);
                var cmdName = parsedCmd.name;
                var argsArray = Array.from(parsedCmd.args);
                executeCommand(this, cmdName, argsArray);
            } catch (e) {
                this.error(new String(e));
            }
        } else {
            this.echo("Vous plaisantez ?\nMerci de lire l'aide !!!\n(tapez : help)");
        }
    },
        {
            greetings: '[[;violet;]---------------------------------------------------\n|             ___  ______  ________  _________    |\n|            /  / /      |/       / /  ___   |    |\n|     ___   /  / /   /\\     /\\   / /  /___|  |    |\n|    /  /__/  / /   /  \\___/ /  / /  _____   |    |\n|   /________/ /___/        /__/ /__/     |__|    |\n|                                                 |\n|    Curriculum vitae - v: 1.0.0 - 05/08/2020     |\n|_________________________________________________|]\n\nBienvenue sur mon cv en ligne de commande !\nTapez "help" pour une liste des commandes\n',
            name: 'cv_jma',
            height: 200,
            prompt: '[[;violet;]root@jma-cv>] ',
            completion: ['help', 'skills', 'career', 'achievs', 'langs', 'hobbies', 'down']
        });

    var executeCommand = function (terminal, cmd, args) {
        //terminal.echo('Executing command: ' + cmd + "\nWith args: " + args);
        $.getJSON("/data/data.json", function (json) {
            //console.log(json);
            jsonData = json;

            switch (cmd) {
                case "help":
                    showHelp(terminal, args);
                    break;
                case "skills":
                    showSkills(terminal, args, jsonData.skills);
                    break;
                case "education":
                    showEducation(terminal, args, jsonData.education);
                    break;
                case "career":
                    showCareer(terminal, args, jsonData.career);
                    break;
                case "achievs":
                    showAchievs(terminal, args, jsonData.achievs);
                    break;
                case "langs":
                    showLangs(terminal, jsonData.langs);
                    break;
                case "hobbies":
                    showHobbies(terminal, jsonData.hobbies);
                    break;
                case "down":
                    showPDF();
            }
        });
    }

    var showHelp = (terminal, args) => {

        let data = "\n[[;yellow;]* LISTE DES COMMANDES *]\n\nhelp\t\t:\tAffiche cette liste de commandes\nskills\t\t:\tAffiche mes compétences techniques\neducation\t:\tAffiche mes formations et diplomes\ncareer\t\t:\tAffiche mon parcours professionnel\nachievs\t\t:\tAffiche mes principales réalisations\nlangs\t\t:\tAffiche les lanques que je parle\nhobbies\t\t:\tAffiche mes centres d'intérêts et loisirs\ndown\t\t:\tPour télécharger directement mon CV au format PDF\n\nVous pouvez aussi utiliser le nom d'une commande comme argument\npour afficher une aide spécifique.\n\nFormat : help <commande>\nExemple : help skills\n";

        if (args.length > 1) {
            //terminal.echo('too much');
            return;
        }

        if (args[0]) {
            switch (args[0]) {
                case "skills":
                    data = "\n* COMMANDE : skills *\n\nVous pouver utiliser la commande 'skills' avec un argument numérique\n(exemple: 'skills 1' affichera les langages de développement que je connais).\n\nListe des arguments valides:\n\n1. Affiche les langages de développement que je connais\n2. Affiche les langages structurés que je connais\n3. Affiche les système d'exploitation que je maitrise\n4. Affiche les SGBD que je connais\n5. Affiche les IDE/Logiciels que je connais\n6. Affiche mes connaissances techniques\n";
                    break;
                case "career":
                    data = "\n* COMMANDE : career *\n\nVous pouver utiliser la commande 'career' avec un argument numérique\n(exemple: 'career 1' affichera les détails de mon expérience chez STAR Paris).\n\nListe des arguments valides:\n\n1. Affiche mon expérience chez STAR Paris\n2. Affiche mon expérience chez MAXIPHONE\n3. Affiche mon expérience chez GS4\n";
                    break;
                default:
                    data = "\n* COMMANDE : " + args[0] + " *\n\nPas d'aide supplémentaire pour cette commande\n";
                    break;
            }
        }

        terminal.echo(data);
    }

    var getCategory = (category) => {
        data = "\n[[;orange;]* " + category.title + " *]\n\n";
        count = 1;
        for (item of category.content) {
            data += count + ". " + item + "\n";
            count++;
        }
        return data;
    };

    var getNotedCategory = (entry) => {
        data = "\n[[;orange;]* " + entry.title + " *]\n\n";
        count = 1;
        for (item of entry.content) {
            data += count + ". " + item.name + " :\t";
            for (n = 0; n < item.note; n++)
                data += "* ";
            for (p = 0; p < 5 - item.note; p++)
                data += ". ";

            data = data.substring(0, data.length - 1);
            data += "\t(" + item.note + "/5)\n";
            count++;
        }
        
        return data;
    };

    var showLangs = (terminal, langs) => {
        data = getNotedCategory(langs);
        terminal.echo(data);
    }

    var showHobbies = (terminal, hobbies) => {
        let data = getCategory(hobbies);
        terminal.echo(data);
    }

    var showSkills = (terminal, args, skills) => {
        let data = "";

        if (args == null || args[0] == 0 || args == "" || args[0] > skills.length) {
            for (let c = 0; c < skills.length; c++) {
                data += getNotedCategory(skills[c]);
            }
        }
        else if (args[0]) {
            let skill = skills[args[0] - 1];
            data = getNotedCategory(skill);
        }
        terminal.echo(data);
    }

    var showEducation = (terminal, args, education) => {
        var data = "\n[[;yellow;]* " + education.title + " *]\n\n";
        for (let c = 0; c < education.content.length; c++) {
            data += getDiploma(education.content[c]);
        }
        terminal.echo(data);
    }

    var getDiploma = (diploma) => {
        data = "[[;orange;]";
        data += "** " + diploma.title + " **] ";
        data += "[[;violet;](";
        data += diploma.year + ")]\n\n";
        data += "[[;pink;]Domaines de formation :]\n\n"

        count = "1";
        for(skill of diploma.skills) {
            data += count + ". " + skill + "\n";
            count++;
        }

        data += "\n";
        return data;
    };

    var getCareer = (career) => {
        data = "[[;violet;]";
        data += "*** " + career.years + " ***\n";
        data += "* " + career.company + " *\n";
        data += "* " + career.title + " *]\n\n";

        count = "1";
        for (task of career.tasks) {
            data += count + ". " + task + "\n";
            count++;
        }

        data += "\n";
        return data;
    };

    var showCareer = (terminal, args, careers) => {
        var data = "\n[[;orange;]** " + careers.title + " **]\n\n";

        if (args == null || args[0] == 0 || args == "" || args[0] > careers.content.length) {
            for (var c = 0; c < careers.content.length; c++) {
                data += getCareer(careers.content[c]);
                data += "\n";
            }
            data = data.substr(0, data.length - 1);
        }
        else if (args[0]) {
            let career = careers.content[args[0] - 1];
            data += getCareer(career);
            data = data.substr(0, data.length -1);
        }
        terminal.echo(data);
    }

    var showAchievs = (terminal, args, achievs) => {
        let data = "\n[[;orange;]* " + achievs.title + " *]\n\n";
        let count = 1
        for (achiev of achievs.content) {
            data += "[[;violet;]" + count + ". " + achiev.years + " :] " + achiev.text + "\n\n";
            count++;
        }
        data = data.substr(0, data.length - 1);
        terminal.echo(data);
    }

    var showPDF = () => {
        window.open("/data/CV_CDA_JM_Aubertin.pdf");
    }
});