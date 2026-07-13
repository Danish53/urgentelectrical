"use client";

import AppImage from "@/components/common/AppImage";
import { HOME_PROJECTS } from "@/data/homeProjects";
import { CONTAINER, SECTION_PY } from "./constants";
import SectionHeader from "./SectionHeader";

function ProjectCard({ project }) {
  return (
    <article className="home1-card home1-card-shine overflow-hidden group">
      <div className="h-44 relative bg-[var(--home1-surface)] overflow-hidden">
        <AppImage
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          fallback={
            <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm bg-[var(--home1-red)]">
              {project.category}
            </div>
          }
        />
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-black/55 text-white">
          {project.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-[var(--home1-text)] text-[15px] leading-snug">{project.title}</h3>
      </div>
    </article>
  );
}

export default function ProjectsHome1() {
  return (
    <section
      id="projects"
      className={`home1-section-surface ${SECTION_PY} overflow-x-clip scroll-mt-28`}
      aria-labelledby="home-projects-heading"
    >
      <div className={CONTAINER}>
        <SectionHeader
          id="home-projects-heading"
          eyebrow="Recent projects"
          title="Recent Work across Nottingham & East Midlands"
          description="A snapshot of domestic upgrades, commercial testing, and emergency repairs completed by our team."
          align="center"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOME_PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
