import "./styles.css";

const Sidebar = (props: {
  id: string;
  barClass: string;
  barChildren: any;
  class: string;
  children: any;
}) => (
  <div class="sidebar bg-white dark:bg-zinc-900 dark:text-white">
    <input id={props.id} type="checkbox" class="sidebar-toggle" />
    <nav class="sidebar-mobile md:!hidden">
      <label for={props.id} class="sidebar-mobile-overlay"></label>
      <div class={props.barClass}>{props.barChildren}</div>
    </nav>

    <nav class="sidebar-desktop hidden md:!flex">
      <div class={props.barClass}>{props.barChildren}</div>
    </nav>

    <div class={`sidebar-content ${props.class}`}>{props.children}</div>
  </div>
);

export default Sidebar;
