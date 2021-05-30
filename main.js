#!/usr/bin/env node



//From our terminal first we are going to take the input of the directory folder and for that we need to use "slice" function 

let inputArr=process.argv.slice(2);
let fs=require("fs");
let path=require("path");

let types={
    "Photos":["jpg"],
    "Videos":["mp4","mkv"],
    "Zip":["zip","rar","tar","gz","iso"],
    "Documents":["docx","doc","pdf","xlsx","txt","odt","ods","odp","odg","odf","tex"],
    "Apps":["exe","pkg","deb","dmg"]
}
//console.log(inputArr);

//COMMANDS WE WILL TAKE INPUT
// 1. node main.js tree "Directorypath"
// 2. node main.js organize "Directorypath"
// 3. node main.js help "Directorypath"

let command=inputArr[0];
switch(command){
    case "tree":
        treefn(inputArr[1]);
        break;
    case "organize":
        organizefn(inputArr[1])
        break;
    case "help":
        helpfn();
        break;
    default:
        console.log("Please input a valid input");
        break;
}

function treefn(dirPath)
{
    if(dirPath===undefined)
    {// Need to do a check if a path is entered or not
        treeHelper(process.cwd(), "");
        return ;
    }
    else{
        // checking if the path is a valid path or not
 
        let doesExist=fs.existsSync(dirPath);
        if(!doesExist)
        {
            console.log("ENter a valid path");
            return;
        }
        else{
          treeHelper(dirPath,"");
        }
    console.log("tree implemented");
}
}
function treeHelper(dirPath,indent){
    if(fs.lstatSync(dirPath).isFile()==true){
        fileName=path.basename(dirPath);
        console.log(indent +"├──"+fileName);
    }
    else{
        let dirName=path.basename(dirPath);
        console.log(indent+"└──"+dirName);
        let children=fs.readdirSync(dirPath)
        for(let i=0;i<children.length;i++)
        {
         let childPath=path.join(dirPath,children[i]);
        treeHelper(childPath,indent+"\t");
        }

    }
    
}
function organizefn(dirPath)
{
    // 1. input-> directory path given 
    let destination_path;
    if(dirPath===undefined)
    {// Need to do a check if a path is entered or not
        destination_path = process.cwd();
       
    }
    else{
        // checking if the path is a valid path or not
 
        let doesExist=fs.existsSync(dirPath);
        if(!doesExist)
        {
            console.log("ENter a valid path");
            return;
        }
        else{
            // 2. create-> organize files -> inside the directory
             destination_path=path.join(dirPath,"Organized_Folder");
            if(fs.existsSync(destination_path)==false)
            fs.mkdirSync(destination_path);
        }
    }
organize_helper(dirPath,destination_path);
    // console.log("organise implemented for the directory",path);
}

function organize_helper(src,dest)
{
    //3. to identify categories of all the file present in the src folder
    let child_names=fs.readdirSync(src);
   // console.log(file_names);
   // CHecking if it is a file or folder
   for(let i=0;i<child_names.length;i++)
   {
       let childAddress=path.join(src,child_names[i]);
       let isFile=fs.lstatSync(childAddress).isFile();
       if(isFile)
       {
      
       let category= getCategory(child_names[i]);
      // console.log(category);
      // 4. copy/cut the files into the organised folder
         sendFile(childAddress,dest,category)

    }


   }
}

function sendFile(childSrc,dest,category)
{
    let category_folder_path=path.join(dest,category);
    if(fs.existsSync(category_folder_path)==false){
         // create a new folder of the category
         fs.mkdirSync(category_folder_path)
    }
    let  fileName=path.basename(childSrc);
    let  destFilePath=path.join(category_folder_path,fileName);
    fs.copyFileSync(childSrc,destFilePath);
    fs.unlinkSync(childSrc);
    console.log(fileName," cut to ",category);
}
function getCategory(name){
    let ext=path.extname(name);
    ext=ext.slice(1);
 //   console.log(ext);
 for(let type in types)
 {
   //  console.log(type);
    let currType=types[type];
    {
        for(let i=0;i<currType.length;i++)
        {
            if(currType[i]===ext)
            {
                
                return type;

            }
            
        }
    }
    
 }
 return "other";   
}
function helpfn()
{
    console.log(`  
      Go to the directory and choose any one from the ist of all commands: 
                        peppie tree 
                        peppie organize 
                        peppie help  `);
}