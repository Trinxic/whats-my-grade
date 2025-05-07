import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { FileTreeComponent } from "./components/file-tree/file-tree.component";
import { MatTreeModule } from "@angular/material/tree";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { LeftNavBarComponent } from "./components/left-nav-bar/left-nav-bar.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    LeftNavBarComponent,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {}
