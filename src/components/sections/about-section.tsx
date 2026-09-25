import { CatalogLabel } from "@/components/catalog-label";
import { Reveal } from "@/components/reveal";
import { profile } from "@/data/portfolio";

export function AboutSection() {
  return (
    <section
      id="about"
      className="paper-texture scroll-mt-18 bg-paper px-5 py-20 text-ink sm:px-8 sm:py-24 lg:px-12 lg:py-30"
    >
      <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
        <Reveal>
          <CatalogLabel index="01">Liner notes</CatalogLabel>
          <h2 className="mt-8 max-w-xl font-display text-5xl leading-[0.94] sm:text-6xl lg:text-7xl">
            Learning by building.
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="lg:pt-16">
          <p className="max-w-3xl text-xl leading-9 text-ink/75 sm:text-2xl sm:leading-10">
            {profile.biography}
          </p>
          <div className="mt-10 border-l-2 border-accent pl-6">
            <p className="font-catalog text-xs tracking-[0.12em] text-ink/50">
              CAREER DIRECTION
            </p>
            <p className="mt-3 max-w-2xl font-display text-2xl leading-tight sm:text-3xl">
              {profile.careerGoal}
            </p>
          </div>

          <dl className="mt-12 grid gap-0 border-y border-ink/20 sm:grid-cols-2">
            <div className="border-b border-ink/20 py-5 sm:border-b-0 sm:border-r sm:pr-6">
              <dt className="font-catalog text-xs tracking-[0.1em] text-ink/50">
                CURRENT STUDY
              </dt>
              <dd className="mt-2 leading-7">Computer Networking and Telecommunications</dd>
            </div>
            <div className="py-5 sm:pl-6">
              <dt className="font-catalog text-xs tracking-[0.1em] text-ink/50">
                LOCATION
              </dt>
              <dd className="mt-2 leading-7">{profile.location}</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
