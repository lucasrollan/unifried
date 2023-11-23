
import { useAppDispatch, useAppSelector } from "@/store"
import { useEffect } from "react"
import style from './style.module.css'
import { fetchCharacters } from '@/store/actors/actorsSlice'
import { selectCurrentCharacter } from '@/store/actors/selectors'
import { useSession } from "next-auth/react"

function CharacterSummary() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchCharacters())
    }, [dispatch])

    const { data, status } = useSession();
    const currentCharacter = useAppSelector(selectCurrentCharacter)

    return <div className={style.container}>
        <div className={style.banner}>
            <div className={style.userProfilePicture}>
                <img className={style.userProfilePicture} src={data?.user?.image || undefined} />
            </div>
            <div>
                <div>{currentCharacter?.name}</div>
            </div>
            <div>
                <div>
                    {currentCharacter?.tokens}
                    {' '}
                    <img  className={style.rewardIcon} src="/icons/65516_cash_currency_icon.png" />
                </div>
            </div>
        </div>
    </div>
}

export default CharacterSummary