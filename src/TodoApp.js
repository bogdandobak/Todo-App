import React, { useCallback } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { useLocalStorage } from './helpers/useLocalStorage';

import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';

function TodoApp() {
  const [storageTodos, setStorageTodos] = useLocalStorage('todos', []);

  const onCreate = useCallback(
    (title) => {
      setStorageTodos(prevTodos => [...prevTodos, {
        completed: false,
        title,
        id: +new Date(),
      }]);
    }, [],
  );

  const onComplete = useCallback(
    (id) => {
      const newTodos = storageTodos.map(todo => (todo.id === id ? ({
        ...todo,
        completed: !todo.completed,
      })
        : todo));

      setStorageTodos(newTodos);
    }, [storageTodos],
  );

  const onToggle = useCallback(
    (completed) => {
      const newTodos = storageTodos.map(todo => ({
        ...todo,
        completed: !completed,
      }));

      setStorageTodos(newTodos);
    }, [storageTodos],
  );

  const onRemove = useCallback(
    (id) => {
      const newTodos = storageTodos.filter(todo => todo.id !== id);

      setStorageTodos(newTodos);
    }, [storageTodos],
  );

  const onRemoveCompleted = useCallback(
    () => {
      const newTodos = storageTodos.filter(todo => !todo.completed);

      setStorageTodos(newTodos);
    }, [storageTodos],
  );

  return (
    <section className="todoapp">
      <TodoInput onCreate={onCreate} />
      <section className="main">

        <Switch>
          {storageTodos.length > 0
            && (
              <TodoList
                todos={storageTodos}
                onComplete={onComplete}
                onToggle={onToggle}
                onRemove={onRemove}
              />
            )}
          <Redirect to={TodoList.link({ status: 'all' })} />
        </Switch>
      </section>

      {storageTodos.length > 0
        && (
          <TodoFilter
            todos={storageTodos}
            onRemoveCompleted={onRemoveCompleted}
          />
        )}
    </section>
  );
}

export default TodoApp;
