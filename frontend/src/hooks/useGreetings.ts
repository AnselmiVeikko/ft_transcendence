import { useState, useEffect } from 'react';

const welcomePhrases = [
  'greeting_settings_need',
  'greeting_settings_something',
  'greeting_settings_time',
  'greeting_settings_updates',
  'greeting_settings_want',
];

export const useGreetings = () => {
  const [greetingKey, setGreetingKey] = useState(welcomePhrases[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * welcomePhrases.length);
    setGreetingKey(welcomePhrases[randomIndex]);
  }, []);

  return greetingKey;
};