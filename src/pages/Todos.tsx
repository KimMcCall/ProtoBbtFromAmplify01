import { useEffect, useState } from "react";
import { Flex } from "@aws-amplify/ui-react";
import type { Schema } from "../../amplify/data/resource";
import { dbClient } from "../main";
import PageWrapper from "../components/PageWrapper";

function Todos() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    console.log(`DBM: calling Todo.observeQuery() at ${Date.now() % 10000}`);
    dbClient.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    console.log(`DBM: calling Todo.create() at ${Date.now() % 10000}`);
    dbClient.models.Todo.create({ content: window.prompt("Todo content") });
  }  
  
  function deleteTodo(id: string) {
    console.log(`DBM: calling Todo.delete() at ${Date.now() % 10000}`);
    dbClient.models.Todo.delete({ id })
  }

  return (
    <PageWrapper>
      <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
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
      </Flex>
    </PageWrapper>
  );
}

export default Todos;
