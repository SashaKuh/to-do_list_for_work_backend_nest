import { Module, OnModuleInit } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import mongoose from "mongoose";

const user = 'sashakuharchuk04';
const pwd = 'coJdtVbtgA8TLeHG';
const urlDB = 'cluster0.kqeg4.mongodb.net';
const db = 'todo';

const url = `mongodb+srv://${user}:${pwd}@${urlDB}/${db}?retryWrites=true&w=majority&appName=Cluster0`
@Module({
        imports: [
                MongooseModule.forRoot(url),
        ],
})
        
export class MongoDBModule implements OnModuleInit{
        async onModuleInit() {
                mongoose.connection.on("connected", () => {
                        console.log("Mongo connection successfully established!");
                });

                mongoose.connection.on("error", (err) => {
                        console.error("Mongo connection error:", err);
                })
        }
}