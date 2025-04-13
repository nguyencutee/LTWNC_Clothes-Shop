import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://tranthitruclinh135:b74178544521@cluster0.zvj9984.mongodb.net/food-del').then(() => console.log("DB Connected"))
}