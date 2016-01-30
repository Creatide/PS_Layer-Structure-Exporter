// Layer Structure Exporter (Adobe Photoshop Script)
// =================================================
//
// Adobe Photoshop script to export layer structure in "Text Tree" or "Markdown" format to text file.
//
// JavaScript Script for Adobe Photoshop.
// Tested with Adobe Photoshop CC 2014 & CC 2015, Windows 10 (64-bit) & OSX Yosemite.
// This script provided "as is" without warranty of any kind.
// Free to use and distribute.
//
// Version History
// 1.0.0 - 2015-01-21
//
// Copyright(c) 2016 Creatide / Sakari Niittymaa
// http://www.creatide.com
// hello@creatide.com
//
// The MIT License (MIT). 
// Full licence can be found from end of script.

#target photoshop

var scriptName = "Layer Structure Exporter";
var openDocs = app.documents;
var activeDoc = app.activeDocument;
var activeDocName = activeDoc.name;
var totalLayerNum = 0;
var layerNameMaxLength = 20;
var results = "";
var saveFileName = "";
var winLoading;

// Markdown & Text syntax
var mdBold = "**";
var mdTitle = "##";
    
// Set active document path & use desktop if there is error
var activeDocPath;
try {
    activeDocPath = app.activeDocument.path;
} catch (e) {
    $.writeln(e);
    activeDocPath = Folder.desktop;
}


// Function to start scanning process
function startProcess(syntax) {
    
    // Set Filename for the text file
    var fileType = (syntax) ? ".md" : ".txt"; 
    saveFileName = activeDocPath + "/" + activeDocName.substring(0, activeDocName.length -4) + "_" + scriptName + fileType;
    
    // Results for the output
    results = (syntax) ? mdTitle + activeDoc.name + " " + scriptName + "\n\n" : activeDoc.name + " " + scriptName + "\n\n";
    
    // Create Progressbar Window
    winLoading = new Window("window{ text:'Progress', bar:Progressbar{bounds:[20,20,280,31], value:0, maxvalue:100}, name: StaticText {text: ''} };");
    winLoading.alignChildren = ["fill", "fill"];
    winLoading.center();
    winLoading.show();

    // Scan all layers & set layerNum start number for result hierarchy
    getLayerNames (activeDoc, 0, syntax);
    
    // Close progressbar
    winLoading.close();

    // Save file to txt file
    writeTxtFile (saveFileName, results);
}


// Recursive loop every layers included groups
function getLayerNames ( doc, layerNum, syntax ) {
    
    layerNum++;
    
    // Output syntax for filetree: Markdown or Text
    if (syntax) {
        var dirTreeText = (layerNum > 1) ? Array(layerNum).join("\t") + Array(2).join("* ") : "* ";
    } else {
        var dirTreeText = (layerNum > 1) ? Array(layerNum).join("   |") + "-- " : "";
    }
    
    // Check if there is already array
    if (!returnLayers) {
        var returnLayers = new Array();
    }
    
    // Loop layers recursive
    for ( var i = 0, count = doc.layers.length; i < count; i++ ) {
        
        var layerRef = doc.layers[i];
        
        // Update progressbar
        winLoading.bar.value = count / i;
        winLoading.name.text = (winLoading.name.text.length > layerNameMaxLength) ? layerRef.name.substring(0,layerNameMaxLength) + "..." : layerRef.name;
        winLoading.update();
        
        if ( layerRef.typename != "LayerSet" ) {
            totalLayerNum++;
            returnLayers = returnLayers.concat ( layerRef );
            results += dirTreeText + layerRef.name + "\n";
        } else {
            returnLayers = returnLayers.concat ( layerRef );
            // Use bold for markdown syntax
            totalLayerNum++;
            (syntax) ? results += dirTreeText + mdBold + layerRef.name + mdBold + "\n" : results += dirTreeText + layerRef.name + "\n"; 
            returnLayers = returnLayers.concat ( getLayerNames (layerRef, layerNum, syntax) );
        }
    }

}


// Write result to file
function writeTxtFile( filename, output ) {
    var txtFile = new File(filename);
    txtFile.open("w");
    txtFile.writeln(output);
    txtFile.close();
}


// GUI
startGUI();
function startGUI() {
    
    // Create Main Window
    var win = new Window( "dialog", scriptName, undefined );
    
    // Style for Main Window
    win.orientation = "column";
    win.alignChildren = ["fill", "fill"];

    // PANEL: Syntax Type Panel
    var syntaxGrp = win.add("panel", undefined, "Syntax Type");
    syntaxGrp.orientation = "row";
    syntaxGrp.margins = [10, 15, 10, 12];
    syntaxGrp.alignChildren = ["fill", "fill"];
    
    var radio1 = syntaxGrp.add ("radiobutton", undefined, "Text Tree");
    var radio2 = syntaxGrp.add ("radiobutton", undefined, "Markdown");
    radio1.value = true;
    
    // GROUP: Button Group
    var buttonGrp = win.add('group {orientation: "row"}');
    buttonGrp.alignChildren = ["fill", "fill"];
    
    // BTN: Close button
    var quitBtn = buttonGrp.add("button", undefined, "Close");
    quitBtn.helpTip = "Press Esc to Close";
    quitBtn.onClick = function() {   
        win.close();   
    } 

    // BTN: Start button
    var startBtn = buttonGrp.add("button", undefined, "Start");
    startBtn.helpTip = "Start layer scanning process";
    startBtn.onClick = function() {
        win.close();
        startProcess(!radio1.value);
        alert ("Layer-Structure saved to: " + saveFileName, "Process Completed!");
    }

    // Centering & Show Window
    win.center();
    win.show(); 
}

// The MIT License (MIT)
// =====================
// 
// Copyright (c) 2016 Creatide / Sakari Niittymaa
// http://www.creatide.com
// hello@creatide.com
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.