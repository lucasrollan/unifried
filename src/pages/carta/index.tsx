import { useState } from 'react'
import style from './style.module.css'

function Carta () {
    const [highlighted, setHighlighted] = useState<number>(-1)

    return <div className={style.container}>
        <main className={style.paper}>
            <div className={style.heading}>
                <div>
                    <input className={style.blankSpace} type="text" placeholder="lugar" />
                </div>
                <div>
                    <input className={[style.blankSpace, style.date].join(' ')} type="text" placeholder="--/--/----" />
                </div>
            </div>
            <p className={0 === highlighted ? style.highlighted : ''}>
                Querido/a <input className={style.blankSpace} type="text" placeholder="tu nombre" /></p>
            <p className={1 === highlighted ? style.highlighted : ''}>
                Te escribo para contarte que estoy muy feliz con mi trabajo como <input className={style.blankSpace} type="text" placeholder="tu futura profesión" />.
                <br />
                Lo que más me gusta de esta profesión es <input className={style.blankSpace} type="text" placeholder="primer cosa que te gusta" /> y <input className={style.blankSpace} type="text" placeholder="segunda cosa que te gusta" />.
            </p>
            <p className={2 === highlighted ? style.highlighted : ''}>
                Te vas a dar cuenta que esta profesión es la adecuada para vos, porque <input className={style.blankSpace} type="text" placeholder="razón de tu futuro éxito" />.</p>
            <p className={3 === highlighted ? style.highlighted : ''}>
                Aunque al principio puede haber dudas, con el tiempo, tanto vos como <input className={style.blankSpace} type="text" placeholder="otras persona(s) que podrían tener dudas" /> se van a dar cuenta de que era una gran elección.</p>
            <p className={4 === highlighted ? style.highlighted : ''}>
                Lo que realmente te va a ayudar a ingresar y destacarte en esta disciplina es <input className={style.blankSpace} type="text" placeholder="primera cosa a tu favor" /> y  <input className={style.blankSpace} type="text" placeholder="segunda cosa a tu favor" />.</p>
            <p className={5 === highlighted ? style.highlighted : ''}>
                También va a ser una gran ayuda conocer gente en <input className={style.blankSpace} type="text" placeholder="un lugar donde encontrar gente que se dedica a lo mismo" /> y  <input className={style.blankSpace} type="text" placeholder="otro lugar más" />que te van a ofrecer orientación y consejos valiosos.</p>
            <p className={6 === highlighted ? style.highlighted : ''}>
                En este momento te puede preocupar <input className={style.blankSpace} type="text" placeholder="una cosa que te preocupe" />, pero al final no va a ser un problema gracias a <input className={style.blankSpace} type="text" placeholder="una cosa que va a hacer que todo salga bien" />.</p>
            <p className={7 === highlighted ? style.highlighted : ''}>Te espera una carrera profesional y una vida interesante y llena de aventuras.</p>
            <p className={8 === highlighted ? style.highlighted : ''}>PD: <input className={style.blankSpace} type="text" placeholder="comentá algo que te imagines sobre tu futuro en esta profesión" /></p>

            <p className={9 === highlighted ? style.highlighted : ''}>
                Con amor,
                <br />
                <input className={style.blankSpace} type="text" placeholder="tu nombre" /> del futuro
            </p>
        </main>
    </div>

}

export default Carta

/*
lugar                                                                                                                              fecha


Querido/a tu nombre:

Te escribo para contarte que estoy muy feliz con mi trabajo como tu futura profesión.
Lo que más me gusta de esta profesión es primer cosa que te gusta y segunda cosa que te gusta.

Te vas a dar cuenta que esta profesión es la adecuada para vos, porque razón de tu futuro éxito.
Aunque al principio puede haber dudas, con el tiempo, tanto vos como otras persona(s) que podrían tener dudas, se van a dar cuenta de que era una gran elección.

Lo que realmente te va a ayudar a ingresar y destacarte en esta disciplina es primera cosa a tu favor y segunda cosa a tu favor.

También va a ser una gran ayuda conocer gente en un lugar donde encontrar gente que se dedica a lo mismo y otro lugar más que te van a ofrecer orientación y consejos valiosos.

En este momento te puede preocupar una cosa que te preocupe, pero al final no va a ser un problema gracias a una cosa que va a hacer que todo salga bien.

Te espera una carrera profesional y una vida interesante y llena de aventuras.

PD:

tu nombre del futuro.



*/