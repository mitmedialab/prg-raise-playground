"use strict";
exports.__esModule = true;
var ts = require("typescript");
var path = require("path");
var transpileDir = '.transpiled';
var transpileAndImport = function (dirName) {
    var absolutePath = path.resolve('');
    console.log(absolutePath);
    var pathToDir = path.resolve(path.dirname(__dirname), 'extensions', dirName);
    console.log(pathToDir);
    var outDir = path.join(pathToDir, transpileDir);
    try {
        var options = {
            noEmitOnError: true,
            noImplicitAny: true,
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            outDir: outDir
        };
        var entry = path.join(pathToDir, "index.ts");
        var program = ts.createProgram([entry], options);
        var emitResult = program.emit();
    }
    catch (_a) {
        console.log(pathToDir);
        console.log(outDir);
    }
    return require(outDir);
};
exports["default"] = transpileAndImport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwaWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyYW5zcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBa0M7QUFDbEMsMkJBQThCO0FBRTlCLElBQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQztBQUVuQyxJQUFNLGtCQUFrQixHQUFHLFVBQUMsT0FBZTtJQUN6QyxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDMUIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2xELElBQUk7UUFDRixJQUFNLE9BQU8sR0FBdUI7WUFDbEMsYUFBYSxFQUFFLElBQUk7WUFDbkIsYUFBYSxFQUFFLElBQUk7WUFDbkIsTUFBTSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRztZQUMzQixNQUFNLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRO1lBQzlCLE1BQU0sUUFBQTtTQUNQLENBQUM7UUFFRixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMvQyxJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbkQsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ25DO0lBQ0QsV0FBTTtRQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNyQjtJQUVELE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3pCLENBQUMsQ0FBQTtBQUVELHFCQUFlLGtCQUFrQixDQUFDIn0=