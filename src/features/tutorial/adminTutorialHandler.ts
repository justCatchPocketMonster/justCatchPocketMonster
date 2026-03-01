import { MenuHandler, MenuOption, SelectionPath } from "../../utils/menu";
import { Server } from "../../core/classes/Server";
import { buildTitleDescTutorialMenu } from "./tutorialMenuBuilder";
import type { TitleDescTutorialEntry } from "./tutorialMenuBuilder";

const ADMIN_ENTRIES: TitleDescTutorialEntry[] = [
  {
    value: "language",
    labelKey: "tutorialAdminField1Title",
    titleKey: "tutorialAdminField1Title",
    descKey: "tutorialAdminField1Desc",
  },
  {
    value: "spawn",
    labelKey: "tutorialAdminField2Title",
    titleKey: "tutorialAdminField2Title",
    descKey: "tutorialAdminField2Desc",
  },
];

const ADMIN_COLOR = 0xe74c3c;

export class AdminTutorialHandler implements MenuHandler {
  constructor(private server: Server) {}

  getMenuStructure(): MenuOption {
    return buildTitleDescTutorialMenu(
      this.server,
      "tutorialCategoryAdmin",
      "admin",
      "tutorialAdminDescription",
      "tutorialGameplayShortDesc",
      ADMIN_ENTRIES,
      ADMIN_COLOR,
    );
  }

  handleAction(_selectionPath: SelectionPath[]): void {}
}
