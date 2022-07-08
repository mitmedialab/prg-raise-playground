"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var ts = require("typescript");
var glob = require("glob");
var path = require("path");
var fs = require("fs");
var printDiagnostics = function (program, result) {
    ts.getPreEmitDiagnostics(program)
        .concat(result.diagnostics)
        .forEach(function (diagnostic) {
        var flattenedMessage = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n") + "\n";
        if (!diagnostic.file)
            return console.error(flattenedMessage);
        var _a = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start), line = _a.line, character = _a.character;
        console.error("".concat(diagnostic.file.fileName, " (").concat(line + 1, ",").concat(character + 1, "): ").concat(flattenedMessage));
    });
};
var transpileAllTsExtensions = function () {
    var srcDir = path.resolve(__dirname, "..", "src");
    var baseOptions = {
        noEmitOnError: false,
        esModuleInterop: true,
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        rootDir: srcDir
    };
    var queryDir = path.join(srcDir, "extensions");
    glob("".concat(queryDir, "/**/index.ts"), function (err, files) {
        if (err)
            return console.error(err);
        if (!files)
            return console.error("No files found");
        files.forEach(function (file) {
            var dir = path.dirname(file);
            fs.writeFileSync(path.join(dir, ".gitignore"), "**/*.js");
        });
        var program = ts.createProgram(files, __assign(__assign({}, baseOptions), { outDir: srcDir, rootDir: srcDir }));
        var result = program.emit();
        printDiagnostics(program, result);
    });
};
transpileAllTsExtensions();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwaWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidHJhbnNwaWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBaUM7QUFDakMsMkJBQTZCO0FBQzdCLDJCQUE2QjtBQUM3Qix1QkFBeUI7QUFFekIsSUFBTSxnQkFBZ0IsR0FBRyxVQUFDLE9BQW1CLEVBQUUsTUFBcUI7SUFDbEUsRUFBRSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQztTQUM5QixNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztTQUMxQixPQUFPLENBQUMsVUFBQSxVQUFVO1FBQ2pCLElBQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLDRCQUE0QixDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzlGLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSTtZQUFFLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3ZELElBQUEsS0FBc0IsRUFBRSxDQUFDLDZCQUE2QixDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEtBQU0sQ0FBQyxFQUF4RixJQUFJLFVBQUEsRUFBRSxTQUFTLGVBQXlFLENBQUM7UUFDakcsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxlQUFLLElBQUksR0FBRyxDQUFDLGNBQUksU0FBUyxHQUFHLENBQUMsZ0JBQU0sZ0JBQWdCLENBQUUsQ0FBQyxDQUFDO0lBQ25HLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFBO0FBRUQsSUFBTSx3QkFBd0IsR0FBRztJQUMvQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFcEQsSUFBTSxXQUFXLEdBQXVCO1FBQ3RDLGFBQWEsRUFBRSxLQUFLO1FBQ3BCLGVBQWUsRUFBRSxJQUFJO1FBQ3JCLE1BQU0sRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUc7UUFDM0IsTUFBTSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUTtRQUM5QixPQUFPLEVBQUUsTUFBTTtLQUNoQixDQUFDO0lBRUYsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFFakQsSUFBSSxDQUFDLFVBQUcsUUFBUSxpQkFBYyxFQUFFLFVBQUMsR0FBRyxFQUFFLEtBQUs7UUFFekMsSUFBSSxHQUFHO1lBQUUsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFbkQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7WUFDaEIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixFQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzVELENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLHdCQUFPLFdBQVcsS0FBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLElBQUcsQ0FBQztRQUM3RixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUIsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFBO0FBRUQsd0JBQXdCLEVBQUUsQ0FBQyJ9