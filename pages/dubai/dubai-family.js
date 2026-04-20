import React from 'react'
import Topbar from '../../components/header/Header'
import Offcanvas from '../../components/header/Offcanvas'
import Hero from '../../components/dubai-family-itinerary/Hero'
import PackageDetailsTabs from '../../components/dubai-family-itinerary/PackageDetailsTabs'
import HeroMobile from '../../components/dubai-family-itinerary/HeroMobile'
import Popup from '../../components/corporate/Popup'

export async function getServerSideProps() {
  const { readAll: readPkgs } = require("../../utils/packageStore");

  const SUBTYPE_ORDER = ["Economy", "Deluxe", "Premium"];

  const pkgs = readPkgs()
    .filter(p =>
      p.destination === "Dubai" &&
      p.packageType === "Family" &&
      p.status === "Active"
    )
    .sort((a, b) =>
      SUBTYPE_ORDER.indexOf(a.packageSubtype) - SUBTYPE_ORDER.indexOf(b.packageSubtype)
    );

  return {
    props: { packages: JSON.parse(JSON.stringify(pkgs)) }
  };
}

export default function DubaiFamily({ packages = [] }) {
  return (
    <div className='dubai-family-package'>
      <Topbar />
      <Offcanvas />
      <Hero packages={packages} />
      <HeroMobile />
      <PackageDetailsTabs packages={packages} />
      <Popup />
    </div>
  );
}
