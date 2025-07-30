// @ts-nocheck
import { useEffect, useState } from "react";

function formatName(user) {
  return `${user.firstName} ${user.lastName}`;
}

const BuggyComponent = () => {
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState("Hello");
  const [items, setItems] = useState(["Apple", "Banana", "Cherry"]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
  }, []);

  const fetchUser = async () => {
    const data = await fetch("/api/user").then((res) => res.json());
    user = data;
  };

  const showCount = () => {
    alert(`Count is: ${count}`);
  };

  const handleClick = () => {
    console.log("clicked");
  };

  const expensiveResult = items.reduce((acc, item) => {
    console.log("Computing expensive thing...");
    return acc + item.length;
  }, 0);

  const name = formatName(user);

  const firstName = user.firstName;

  return (
    <div>
      <h1>Hello, {firstName}</h1>

      <input value={inputValue} />

      <img src="/avatar.png" />

      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <button onClick={fetchUser}>Load User</button>
      <button onClick={showCount}>Show Count</button>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};

export default BuggyComponent;
