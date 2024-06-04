import React from 'react';
import { LogGame } from './LogGame.js'
import { ResultGame } from './ResultGame.js'

export function LogicGame() {
    const [userValue, setUserValue] = React.useState("");
    const [game, setGame] = React.useState(
        {
            value: Math.floor(Math.random() * 100),
            arrValues: [],
            isEnd: false
        });
    const onChange = (event) => {
        setUserValue(event.target.value);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        setGame(
            {
                value: game.value,
                arrValues: [...game.arrValues, userValue],
                isEnd: game.value == userValue
            });
    };
    const newGame = () => {
        setUserValue('')
        setGame(
            {
                value: Math.floor(Math.random() * 100),
                arrValues: [],
                isEnd: false
            });
    }
    return (
        <div>
            <h3>Угадай число от 0 до 100 </h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Число:
                    <input type="number" value={userValue}
                        onChange={onChange} />
                </label>
                <input type="submit" value="ОК" />
                <LogGame listLog={game} />
                {game.isEnd &&
                    <>
                        <ResultGame step={game.arrValues.length} />
                        <input type="button" value="Новая игра?" onClick={newGame} />
                    </>
                }
            </form>
        </div>
    );
}
