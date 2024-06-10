import SessionGuard from "@/components/SessionGuard";
import CollectionPanel from "@/components/sour/CollectionPanel";

export default function PimpOverview() {
    return <SessionGuard>
        <div className="PimpOverview">
            <CollectionPanel title="Favorites">
                <ul>
                    <li><a href="/sour/people/NavarroAgustina">Agustina Navarro</a></li>
                    <li><a href="/sour/people/RollanEmma">Emma Rollan</a></li>
                    <li><a href="/sour/people/RollanLucas">Lucas Rollan</a></li>
                    <li><a href="/sour/vehicles/Matsu">Matsu</a></li>
                    {/* <li><a href="/sour/addresses/Narwalstraat5">Narwalstraat 5</a></li>
                    <li><a href="/sour/employment/Miro">Miro</a></li> */}
                </ul>
            </CollectionPanel>
        </div>
    </SessionGuard>
}