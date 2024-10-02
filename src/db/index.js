import { app, sequelize } from "../app.js";

export const syncDatabase = () => {
  sequelize.sync().then((data) => {
    console.log(data);
    console.log("Database & Tables Created!");
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on ${process.env.PORT} port`);
    })
  }).catch((err) => {
    console.log("Database Creation Failed: " + err)
  });
}

export default sequelize;