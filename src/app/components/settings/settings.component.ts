import { Component } from "@angular/core";
import { SelectThemeComponent } from "./select-theme/select-theme.component";
import { MatListModule } from "@angular/material/list";

@Component({
  selector: "app-settings",
  imports: [SelectThemeComponent, MatListModule],
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.css",
})
export class SettingsComponent {}
