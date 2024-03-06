import { createBrowserRouter } from "react-router-dom";
import App from "App";
import CreateQuestion from "components/questions/CreateQuestion";
import CreateUser from "components/users/CreateUser";
import ListQuestions from "components/questions/ListQuestions";
import locations from "locations";
import ShowQuestion from "components/questions/ShowQuestion";
import UpdateQuestion from "components/questions/UpdateQuestion";
import CreateAnswer from "components/answers/CreateAnswer";

export default createBrowserRouter([
  {
    path: locations.root,
    element: <App />,
    children: [
      {
        path: locations.createUser,
        element: <CreateUser />,
      },
      {
        path: locations.listQuestions,
        element: <ListQuestions />,
      },
      {
        path: locations.showQuestion,
        element: <ShowQuestion />,
      },
      {
        path: locations.updateQuestion,
        element: <UpdateQuestion />,
      },
      {
        path: locations.createQuestion,
        element: <CreateQuestion />,
      },
      {
        path: locations.createAnswer,
        element: <CreateAnswer />,
      },
    ],
  },
]);
