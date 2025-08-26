import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function Todos() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }  
  
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  const handleButtonClick = (newDir: string) => {
    navigate(newDir); // Navigate to the new route
  };

  return (
    <main>
      <h1>My Glorious Todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li
            onClick={() => deleteTodo(todo.id)}
            key={todo.id}>{todo.content}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <div>
        <button onClick={() => {handleButtonClick("/public01")}}>Go to 1st public page</button>
      </div>
      <div>
        <button onClick={() => {handleButtonClick("/public02")}}>Go to 2nd public page</button>
      </div>
      <div>
        <button onClick={() => {handleButtonClick("/protected01")}}>Go to 1st protected page</button>
      </div>
      <div>
        <button onClick={() => {handleButtonClick("/protected02")}}>Go to 2nd protected page</button>
      </div>
    </main>
  );
}

export default Todos;
