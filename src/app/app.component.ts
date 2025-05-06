import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FileTreeComponent } from "./components/file-tree/file-tree.component";
import { MatTreeModule } from "@angular/material/tree";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    FileTreeComponent,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {}
