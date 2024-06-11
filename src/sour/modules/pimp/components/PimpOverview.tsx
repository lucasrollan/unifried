import SessionGuard from "@/components/SessionGuard";
import CollectionPanel from "@/components/sour/CollectionPanel";
import Link from "next/link";

export default function PimpOverview() {
    return <SessionGuard>
        <div className="PimpOverview">
            <CollectionPanel title="Favorites">
                <ul>
                    <li><Link href="/sour/people/NavarroAgustina">Agustina Navarro</Link></li>
                    <li><Link href="/sour/people/RollanEmma">Emma Rollan</Link></li>
                    <li><Link href="/sour/people/RollanLucas">Lucas Rollan</Link></li>
                    <li><Link href="/sour/vehicles/Matsu">Matsu</Link></li>
                    {/* <li><Link href="/sour/addresses/Narwalstraat5">Narwalstraat 5</Link></li>
                    <li><Link href="/sour/employment/Miro">Miro</Link></li> */}
                </ul>
            </CollectionPanel>
        </div>
    </SessionGuard>
}