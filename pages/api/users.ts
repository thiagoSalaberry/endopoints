import type { NextApiRequest, NextApiResponse } from 'next'

import { firestore } from '@/lib/firestore';
import Cors from "cors"

const cors = Cors({
  origin: "*",
  methods: ["GET","PATCH","POST"],
  preflightContinue: false,
  optionsSuccessStatus: 204
});

function runMiddleware(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
      cors(req, res, (result:any) => {
        if (result instanceof Error) {
          console.log("NO pasó el test de cors")
          return reject(result);
        };
        console.log("Pasó el test de cors")
        return resolve(result);
      })
    })
  }
const testColl = firestore.collection("test");

class Test {
    id:string;
    data:any;
    ref:any;
    constructor(id:string) {
        this.id = id;
        this.data = {};
        this.ref = testColl.doc(this.id);
    };
    async pull() {
        const doc = await this.ref.get();
        this.data = doc.data();
    };
    async push() {
        await this.ref.update(this.data);
    }
    static async createNewUser(testData:any) {
        const addNewRecord = await testColl.add(testData);
        const newTest = new Test(addNewRecord.id);
        newTest.data = testData;
        return newTest;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method == "GET") {
        res.send("Este es el GET")
    }
    if(req.method == "POST") {
        await runMiddleware(req, res);
        const {email} = req.body;
        const newTest = await Test.createNewUser({email});
        await newTest.pull();    
        const newTestData = newTest.data;
        res.status(200).json({
            method: req.method,
            newTestData
        })
    }
}
