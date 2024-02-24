

import { Source, Conversion, EPD, ImpactCategory, Standard, SubType, Unit } from "epdx"
import { DateTime } from "chrono";
import { v4 as uuidv4 } from "uuid";
import { roundNumber } from "./utils";
export function convertToEpdx(data) {
    //console.log(data)
    const epdArray: EPD[] = [];
    for (const mat of data) {
        if(mat.gwp != null) {
        //console.log(mat)
        //console.log(mat.gwp)
        const epd = createEPD({
            id: mat.uuid,
            name: mat.name,
            declared_unit: mat.declared_unit,
            location: "EU",
            subtype: mat.subtype,
            source: {
                name: mat.EPDsource,
                url: mat.EPDLink
            },
            gwp: {
                a1a3: mat.gwp.A1A2A3,
                a4: mat.gwp.A4,
                a5: mat.gwp.A5,
                b1: mat.gwp.B1,
                b2: mat.gwp.B2,
                b3: mat.gwp.B3,
                b4: mat.gwp.B4,
                b5: mat.gwp.B5,
                b6: mat.gwp.B6,
                b7: mat.gwp.B7,
                c1: mat.gwp.C1,
                c2: mat.gwp.C2,
                c3: mat.gwp.C3,
                c4: mat.gwp.C4,
                d: mat.gwp.D
            }
            });
        epdArray.push(epd);

        //console.log(epd)
        }
    }
    //console.log(epdArray)
    return epdArray;
}

export function calculateTotalEPDGWP(epd: EPD): number {
    let totalGWP = 0;
    if (epd.gwp != null) {
        const gwp = epd.gwp;
        totalGWP += (+gwp.a1a3 ?? 0) + (+gwp.a4 ?? 0) + (+gwp.a5 ?? 0) +
        (+gwp.b1 ?? 0) + (+gwp.b2 ?? 0) + (+gwp.b3 ?? 0) + (+gwp.b4 ?? 0) + (+gwp.b5 ?? 0) + (+gwp.b6 ?? 0) + (+gwp.b7 ?? 0) +
        (+gwp.c1 ?? 0) + (+gwp.c2 ?? 0) + (+gwp.c3 ?? 0) + (+gwp.c4 ?? 0) + (+gwp.d ?? 0);
    }
    
    return totalGWP;
}




export function createEPD({
    id,
    name,
    declared_unit = "UNKNOWN",
    version = "",
    published_date = null,
    valid_until = null,
    format_version = "",
    source = null,
    reference_service_life = null,
    standard = "UNKNOWN",
    comment = null,
    location,
    subtype,
    conversions = null,
    gwp = null,
    odp = null,
    ap = null,
    ep = null,
    pocp = null,
    adpe = null,
    adpf = null,
    penre = null,
    pere = null,
    perm = null,
    pert = null,
    penrt = null,
    penrm = null,
    sm = null,
    rsf = null,
    nrsf = null,
    fw = null,
    hwd = null,
    nhwd = null,
    rwd = null,
    cru = null,
    mfr = null,
    mer = null,
    eee = null,
    eet = null,
    meta_data = null
}: {
    id: string,
    name: string,
    declared_unit?: Unit,
    version?: string,
    published_date?: DateTime | null,
    valid_until?: DateTime | null,
    format_version?: string,
    source?: Source | null,
    reference_service_life?: number | null,
    standard?: Standard,
    comment?: string | null,
    location: string,
    subtype: SubType,
    conversions?: Conversion[] | null,
    gwp?: ImpactCategory | null,
    odp?: ImpactCategory | null,
    ap?: ImpactCategory | null,
    ep?: ImpactCategory | null,
    pocp?: ImpactCategory | null,
    adpe?: ImpactCategory | null,
    adpf?: ImpactCategory | null,
    penre?: ImpactCategory | null,
    pere?: ImpactCategory | null,
    perm?: ImpactCategory | null,
    pert?: ImpactCategory | null,
    penrt?: ImpactCategory | null,
    penrm?: ImpactCategory | null,
    sm?: ImpactCategory | null,
    rsf?: ImpactCategory | null,
    nrsf?: ImpactCategory | null,
    fw?: ImpactCategory | null,
    hwd?: ImpactCategory | null,
    nhwd?: ImpactCategory | null,
    rwd?: ImpactCategory | null,
    cru?: ImpactCategory | null,
    mfr?: ImpactCategory | null,
    mer?: ImpactCategory | null,
    eee?: ImpactCategory | null,
    eet?: ImpactCategory | null,
    meta_data?: Record<string, string> | null
}): EPD {
    return {
        id,
        name,
        declared_unit,
        version,
        published_date,
        valid_until,
        format_version,
        source,
        reference_service_life,
        standard,
        comment,
        location,
        subtype,
        conversions,
        gwp,
        odp,
        ap,
        ep,
        pocp,
        adpe,
        adpf,
        penre,
        pere,
        perm,
        pert,
        penrt,
        penrm,
        sm,
        rsf,
        nrsf,
        fw,
        hwd,
        nhwd,
        rwd,
        cru,
        mfr,
        mer,
        eee,
        eet,
        meta_data
    };
}