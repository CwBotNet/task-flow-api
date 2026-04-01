import mongoose from "mongoose";

const DB_NAME = "taskflow";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_URI}/${DB_NAME}`,
    );
    console.log(
      `\nMongoDb connection !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log(`Db Connection error:${error}`);
    process.exit(1);
  }
};

export { connectDb };
