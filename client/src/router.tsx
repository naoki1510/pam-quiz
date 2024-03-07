import App from "App";
import CreateAnswer from "components/answers/CreateAnswer";
import Authorize from "components/common/Authorize";
import CreateQuestion from "components/questions/CreateQuestion";
import ListQuestions from "components/questions/ListQuestions";
import ShowQuestion from "components/questions/ShowQuestion";
import UpdateQuestion from "components/questions/UpdateQuestion";
import CreateUser from "components/users/CreateUser";
import locations from "locations";
import { createBrowserRouter } from "react-router-dom";

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
        path: locations.createAnswer,
        element: <CreateAnswer />,
      },
      {
        path: locations.root,
        element: <Authorize />,
        children: [
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
        ],
      },
    ],
  },
]);
