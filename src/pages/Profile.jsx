import React, { useEffect, useState } from 'react';
import client from "../components/requests";

const ResultsPage = () => {
    const [results, setResults] = useState([]);
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await client.get(`/api/testresults/?user=${username}`, { withCredentials: true });
                setResults(response.data);
            } catch (error) {
                console.error("Error fetching results", error);
            }
        };

        fetchResults();
    }, [username]);

    return (
        <div>
            <h1>Результаты тестов</h1>
            {results.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Курс</th>
                            <th>Модуль</th>
                            <th>Общий Балл</th>
                            <th>Попыток</th>
                            <th>Дата</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index}>
                                <td>{result.course}</td> {/* Вывод названия курса */}
                                <td>{result.module}</td>
                                <td>{result.total_score}</td>
                                <td>{result.try_numb}</td>
                                <td>{new Date(result.test_date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Нет результатов для данного пользователя.</p>
            )}
        </div>
    );
};

export default ResultsPage;
