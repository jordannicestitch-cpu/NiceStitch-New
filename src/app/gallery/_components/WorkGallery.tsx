"use client";

import Image from "next/image";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { WorkItem, WorkService } from "@/lib/work";
import styles from "./WorkGallery.module.css";

// Card widths produced by .work-grid (auto-fill, 260px minimum) inside the
// 1200px .wrap: four columns of 270px, then three, two and one as it narrows.
const CARD_SIZES =
  "(min-width: 1160px) 270px, (min-width: 876px) 33vw, (min-width: 592px) 50vw, 100vw";

function imageSrc(file: string) {
  return `/assets/img/work/${file.split("/").map(encodeURIComponent).join("/")}`;
}

function imageAlt(item: WorkItem) {
  return item.title || "Work sample";
}

function distinctServices(items: readonly WorkItem[]) {
  const services: WorkService[] = [];
  for (const item of items) {
    if (!services.includes(item.service)) services.push(item.service);
  }
  return services;
}

export function WorkGallery({ items }: { items: readonly WorkItem[] }) {
  const [filter, setFilter] = useState<WorkService | null>(null);
  const [active, setActive] = useState<WorkItem | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const services = distinctServices(items);
  const visible = filter
    ? items.filter((item) => item.service === filter)
    : items;

  function open(item: WorkItem, opener: HTMLButtonElement | null) {
    openerRef.current = opener;
    setActive(item);
  }

  const close = useCallback(() => {
    setActive(null);
    openerRef.current?.focus();
  }, []);

  return (
    <>
      {services.length > 1 && (
        <div
          id="WorkFilters"
          className="work-filters"
          role="group"
          aria-label="Filter by service"
        >
          <FilterButton active={filter === null} onSelect={() => setFilter(null)}>
            All
          </FilterButton>
          {services.map((service) => (
            <FilterButton
              key={service}
              active={filter === service}
              onSelect={() => setFilter(service)}
            >
              {service}
            </FilterButton>
          ))}
        </div>
      )}

      <div id="WorkGrid" className="work-grid">
        {visible.map((item) => (
          <WorkCard key={item.file} item={item} onOpen={open} />
        ))}
      </div>

      {active && <Lightbox item={active} onClose={close} />}
    </>
  );
}

function FilterButton({
  active,
  onSelect,
  children,
}: {
  active: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={active ? "work-filter is-active" : "work-filter"}
      aria-pressed={active}
      onClick={onSelect}
    >
      {children}
    </button>
  );
}

function WorkCard({
  item,
  onOpen,
}: {
  item: WorkItem;
  onOpen: (item: WorkItem, opener: HTMLButtonElement | null) => void;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  // The whole card opens the lightbox on click, as before. The button around
  // the photo is what makes it reachable by keyboard: its click bubbles here.
  return (
    <figure
      className="work-card"
      onClick={() => onOpen(item, triggerRef.current)}
    >
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        aria-label={`View larger photo: ${imageAlt(item)}`}
      >
        {/* 800x600 only declares the 4:3 box; .work-card img sets the real
            size. height: auto stops the height attribute from fixing the
            photo at 600px tall, which would override that rule's aspect-ratio. */}
        <Image
          src={imageSrc(item.file)}
          alt={imageAlt(item)}
          width={800}
          height={600}
          sizes={CARD_SIZES}
          style={{ height: "auto" }}
        />
      </button>
      <figcaption>
        <span className="work-card__tag">{item.service}</span>
        <span className="work-card__title">{item.title}</span>
        {item.detail && (
          <span className="work-card__detail">{item.detail}</span>
        )}
      </figcaption>
    </figure>
  );
}

function Lightbox({ item, onClose }: { item: WorkItem; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      // Nothing inside the lightbox is focusable, so Tab would otherwise move
      // into the page hidden behind it.
      if (event.key === "Tab") event.preventDefault();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      id="WorkLightbox"
      className={`work-lightbox ${styles.lightbox}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="WorkLightboxCaption"
      tabIndex={-1}
      onClick={onClose}
    >
      {/* Plain <img>: the photo's own proportions are unknown here, and
          next/image needs either a fixed width/height or a sized container,
          neither of which fits the max-width/max-height rules on
          .work-lightbox img. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageSrc(item.file)} alt={imageAlt(item)} />
      <p id="WorkLightboxCaption" className="work-lightbox__caption">
        {[item.title, item.service, item.detail].filter(Boolean).join(" · ")}
      </p>
    </div>
  );
}
