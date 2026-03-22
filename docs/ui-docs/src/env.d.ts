/// <reference types="astro/client" />

// Declaración para imports de archivos .astro en archivos .ts
// Permite cualquier export nombrado (para variants de tailwind-variants)
declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const component: AstroComponentFactory;
  export default component;

  // Exports genéricos para variants
  export const carousel: any;
  export const carouselContent: any;
  export const carouselContainer: any;
  export const carouselItem: any;
  export const carouselPrevious: any;
  export const carouselNext: any;
  export const card: any;
  export const cardHeader: any;
  export const cardTitle: any;
  export const cardDescription: any;
  export const cardAction: any;
  export const cardContent: any;
  export const cardFooter: any;
  export const button: any;
  export const accordion: any;
  export const accordionItem: any;
  export const accordionTrigger: any;
  export const accordionContent: any;
  export const alert: any;
  export const alertTitle: any;
  export const alertDescription: any;
  export const badge: any;
  export const calendar: any;
  export const checkbox: any;
  export const checkboxIndicator: any;
  export const collapsible: any;
  export const collapsibleTrigger: any;
  export const collapsibleContent: any;
  export const dialog: any;
  export const dialogTrigger: any;
  export const dialogContent: any;
  export const dialogHeader: any;
  export const dialogFooter: any;
  export const dialogTitle: any;
  export const dialogDescription: any;
  export const drawer: any;
  export const dropdownMenu: any;
  export const empty: any;
  export const emptyHeader: any;
  export const emptyTitle: any;
  export const emptyDescription: any;
  export const emptyContent: any;
  export const emptyMedia: any;
  export const hoverCard: any;
  export const input: any;
  export const kbd: any;
  export const kbdGroup: any;
  export const label: any;
  export const nativeSelect: any;
  export const navigationMenu: any;
  export const pagination: any;
  export const popover: any;
  export const progress: any;
  export const scrollArea: any;
  export const separator: any;
  export const sheet: any;
  export const skeleton: any;
  export const spinner: any;
  export const switchVariant: any;
  export const table: any;
  export const tabs: any;
  export const textarea: any;
  export const toggle: any;
  export const toggleGroup: any;
  export const tooltip: any;
  export const breadcrumb: any;
  export const breadcrumbList: any;
  export const breadcrumbItem: any;
  export const breadcrumbLink: any;
  export const breadcrumbPage: any;
  export const breadcrumbSeparator: any;
  export const breadcrumbEllipsis: any;
  export const aspectRatio: any;
  export const avatar: any;
  export const avatarImage: any;
  export const avatarFallback: any;
  export const alertDialog: any;
  export const alertDialogTrigger: any;
  export const alertDialogContent: any;
  export const alertDialogHeader: any;
  export const alertDialogFooter: any;
  export const alertDialogTitle: any;
  export const alertDialogDescription: any;
  export const alertDialogAction: any;
  export const alertDialogCancel: any;
  export const buttonGroup: any;
  export const item: any;
}
