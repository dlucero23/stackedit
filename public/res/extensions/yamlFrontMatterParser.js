define([
    "classes/Extension",
    "yaml-js",
    ], function(Extension, YAML) {

    var yamlFrontMatterParser = new Extension("yamlFrontMatterParser", "YAML front matter");

    var eventMgr = undefined;
    yamlFrontMatterParser.onEventMgrCreated = function(eventMgrParameter) {
        eventMgr = eventMgrParameter;
    };

    var fileDesc = undefined;
    yamlFrontMatterParser.onFileSelected = function(fileDescParam) {
        fileDesc = fileDescParam;
    };

    var regex = /^(\s*-{3}\s*\n([\w\W]+?)\n\s*-{3}\s*\n)?([\w\W]*)/;
    yamlFrontMatterParser.onPagedownConfigure = function(editor) {
        var converter = editor.getConverter();
        converter.hooks.chain("preConversion", function(text) {
            var results = regex.exec(text),
                yaml;

            if ((yaml = results[2]) && (!fileDesc.frontMatter || fileDesc.frontMatter._yaml != yaml)) {
                fileDesc.frontMatter = undefined;
                try {
                    fileDesc.frontMatter = YAML.parse(yaml);
                    fileDesc.frontMatter._yaml = yaml;
                }
                catch (e) {}
            }
            eventMgr.onMarkdownTrim((results[1] || '').length);
            return results[3];
        });
    };

    return yamlFrontMatterParser;
});