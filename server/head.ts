#! /usr/bin/env node

/////////////////////////////////////////////////////////////
// imports
namespace Imports{
    export var formidable = require('formidable');
    export const http=require('http');
    export const express=require('express');
    export const WebSocket_ = require('ws');
    export const { spawn } = require("child_process")
    export const path_=require("path")
    export const bodyParser = require('body-parser')
    export const fs=require("fs")
}
/////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////
// server parameters

let ___dirname:string = __dirname

let ___port = 9000

/////////////////////////////////////////////////////////////