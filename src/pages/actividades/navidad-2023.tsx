import React from 'react';

interface Activity {
    name: string;
    completed: boolean;
}

interface Props {
    activities: Activity[];
}

const ChristmasActivities: React.FC<Props> = ({ activities }) => {
    return (
        <div style={{ padding: '20px 40px', fontSize: '20px', textAlign: 'center' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
                <h1>Actividades Navideñas</h1>
                <ul>
                    {activities.map((activity) => (
                        <li key={activity.name} style={{position: 'relative', listStyleType: 'none'}}>
                            {activity.completed && <span style={{ color: 'green', position: 'absolute', left: '-25px' }}>✅</span>}
                            <span
                                style={{
                                    color: activity.completed ? 'Darkgreen' : 'black',
                                }}
                            >{activity.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const Page: React.FC = () => {
    return (
        <ChristmasActivities activities={activities} />
    )
}

const activities: Activity[] = [
    {name: 'Celebrar un cumpleaños en el día incorrecto', completed: false},
    {name: 'Visitar un castillo', completed: false},
    {name: 'Visitar una iglesia', completed: false},
    {name: 'Hacer hombrecito de gengibre', completed: false},
    {name: 'Tomarse todo el mate cocido', completed: false},
    {name: 'Hacer una casa de galleta navideña', completed: false},
    {name: 'Patinar sobre hielo', completed: false},
    {name: 'Comer un copo de nieve', completed: false},
    {name: 'Ir a un parque', completed: false},
    {name: 'Alimentar a una cabra', completed: false},
    {name: 'Hacer figuras de origami', completed: false},
    {name: 'Hacer figuras de arcilla para modelar', completed: false},
    {name: 'Pintar una escena navideña', completed: true},
    {name: 'Pintar un paisaje nevado', completed: false},
    {name: 'Pintar una flor', completed: false},
    {name: 'Cantar una canción navideña', completed: false},
    {name: 'Inventar una canción navideña', completed: false},
    {name: 'Dibujar un pato', completed: true},
    {name: 'Jugar un juego de mesa', completed: false},
    {name: 'Armar un rompecabezas', completed: false},
    {name: 'Escuchar musica de un artista que no conocías', completed: false},
    {name: 'Probrar una comida nueva', completed: true},
    {name: 'Ir a un museo', completed: false},
    {name: 'Fotografiar a un cisne', completed: false},
    {name: 'Fotografiar un molino', completed: true},
    {name: 'Fotografiar una bicicleta atada a un puente', completed: true},
    {name: 'Dar una moneda a un músico callejero', completed: false},
    {name: 'Comer olieballen', completed: false},
    {name: 'Comer stroopwafels', completed: true},
    {name: 'Probar 3 quesos de muestra', completed: true},
    {name: 'Ver una película navideña', completed: false},
    {name: 'Visitar un mercado navideño', completed: true},
    {name: 'Ganarle a Lucas en el FIFA', completed: false},
    {name: 'Tomar gluwine', completed: false},
    {name: 'Comer churros con chocolate', completed: false},
    {name: 'Tomar un tren', completed: true},
    {name: 'Tomar un tranvía', completed: true},
    {name: 'Tomar un ferry', completed: false},
    {name: 'Comer malvaviscos asados', completed: false},
    {name: 'Tomar una foto donde la Isa se vea más grande que el Jo', completed: false},
    {name: 'Comer en la casa de Hansel y Gretel (opcional)', completed: false},
    {name: 'Ganar un peluche en una feria', completed: false},
    {name: 'Comer macarrones', completed: true},
    {name: 'Comer cannoli', completed: false},
    {name: 'Comer pizza en Italia', completed: false},
    {name: 'Comer pasta en Italia', completed: false},
    {name: 'Tomar limoncello', completed: false},
    {name: 'Pasear en gondola', completed: false},
    {name: 'Visitar la Basilica de San Pedro', completed: false},
    {name: 'Encontrar una estatua que se parezca a Jesus, pero que no sea', completed: false},
    {name: 'Sacarse una foto sosteniendo la torre de pisa', completed: false},
    {name: 'Chocar los cinco con alguien que este sosteniendo la torre de pisa para una foto', completed: false},
    {name: 'Tirar una moneda en la fontana di trevi', completed: false},
    {name: 'Tomar un vero gelatto italiano', completed: false},
    {name: 'Comer un éclair', completed: false},
]

export default Page;
