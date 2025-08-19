/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import "@testing-library/jest-dom/extend-expect";
import router from "../app/Router";
import { ROUTES_PATH } from "../constants/routes.js";
import mockStore from "../__mocks__/store";
import $ from "jquery";

describe("Given I am connected as an employee", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("When I am on NewBill Page", () => {
    test("Then new bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
      await waitFor(() => screen.getByTestId("icon-mail"));
      const windowIcon = screen.getByTestId("icon-mail");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy();
    });
  });




  describe("When I am on NewBill Page and upload a file with .jpg, .jpeg or .png extension", () => {
    test("should call handleChangeFile with the correct file path", async () => {
      // Simuler le localStorage avec un utilisateur connecté
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      // Mock du store avec la méthode bills()
      // const mockStore = {
      //   bills: jest.fn(() => ({
      //     create: jest.fn().mockResolvedValue({
      //       fileUrl: "https://fakestore.com/biborthday0.jpg",
      //       key: "12345",
      //     }),
      //   })),
      // };

      // Créer un conteneur pour simuler le DOM
      document.body.innerHTML = `
      <div>
        <form data-testid="form-new-bill">
          <div>
            <label for="file" class="bold-label">Justificatif</label>
            <input required="" type="file" class="form-control blue-border" data-testid="file" />
          </div>
        </form>
      </div>
      `;

      // Initialiser l'instance de Bills avec le mock de store
      let newBill = new NewBill({ document, store: mockStore });

      // Spy sur la méthode handleChangeFile
      const spyOn = jest.spyOn(newBill, "handleChangeFile");

      // Créer un fichier simulé
      const file = new File(["dummy content"], "biborthday0.jpg", { type: "image/jpeg" });

      // Créer un objet événement simulé
      const event = {
        preventDefault: jest.fn(),
        target: {
          value: "C:\\fakepath\\biborthday0.jpg",
          files: [file],
        },
      };

      // Appeler la méthode handleChangeFile avec cet événement simulé
      newBill.handleChangeFile(event);

      // Vérifier que la méthode a été appelée
      await waitFor(() => {
        expect(spyOn).toHaveBeenCalled();
      });

      // Vérifier que la méthode preventDefault() a bien été appelée
      expect(event.preventDefault).toHaveBeenCalled();
    });
    test("I should have an alert telling me the extension is wrong", async () => {
      global.alert = jest.fn();

      // Simuler le localStorage avec un utilisateur connecté
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      // Mock du store avec la méthode bills()
      const mockStore = {
        bills: jest.fn(() => ({
          create: jest.fn().mockResolvedValue({}),
        })),
      };

      // Créer un conteneur pour simuler le DOM
      document.body.innerHTML = `
      <div>
        <form data-testid="form-new-bill">
          <div>
            <label for="file" class="bold-label">Justificatif</label>
            <input required="" type="file" class="form-control blue-border" data-testid="file" />
          </div>
        </form>
      </div>
      `;

      // Initialiser l'instance de Bills avec le mock de store
      let newBill = new NewBill({ document, store: mockStore });

      // Spy sur la méthode handleChangeFile
      const spyOn = jest.spyOn(newBill, "handleChangeFile");

      // Créer un fichier simulé
      const file = new File(["dummy content"], "document.pdf", { type: "application/pdf" });

      // Créer un objet événement simulé
      const event = {
        preventDefault: jest.fn(),
        target: {
          value: "C:\\fakepath\\document.pdf",
          files: [file],
        },
      };

      // Appeler la méthode handleChangeFile avec cet événement simulé
      newBill.handleChangeFile(event);

      // Vérifier que la méthode a été appelée
      await waitFor(() => {
        expect(spyOn).toHaveBeenCalled();
      });

      expect(global.alert).toHaveBeenCalledWith(
        "Veuillez télécharger un fichier avec une extension valide (jpeg, jpg, png)."
      );
    });
    
    
  });

  describe("When I submit à new bill without a file", () => { 
    test("I should have an alert", () => {
      global.alert = jest.fn();
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
    
      // Injecter le HTML de NewBill
      document.body.innerHTML = NewBillUI();
    
      const onNavigate = jest.fn();
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
    
      // Simuler la soumission du formulaire sans fichier
      const form = screen.getByTestId("form-new-bill");
      fireEvent.submit(form);
    
      // Vérifier que l’alerte est déclenchée
      expect(global.alert).toHaveBeenCalledWith(
        "Veuillez télécharger un fichier."
      );
    
      // Vérifier que la navigation n’a pas eu lieu
      expect(onNavigate).not.toHaveBeenCalled();
    });
   });

  describe("When I am on NewBill Page and upload a file with .jpg, .jpeg or .png extension", () => {
    test("I should not have an alert", async () => {
      global.alert = jest.fn();

      // Simuler le localStorage avec un utilisateur connecté
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      // Mock du store avec la méthode bills()
      const mockStore = {
        bills: jest.fn(() => ({
          create: jest.fn().mockResolvedValue({}),
        })),
      };

      // Créer un conteneur pour simuler le DOM
      document.body.innerHTML = `
      <div>
        <form data-testid="form-new-bill">
          <div>
            <label for="file" class="bold-label">Justificatif</label>
            <input required="" type="file" class="form-control blue-border" data-testid="file" />
          </div>
        </form>
      </div>
      `;

      // Initialiser l'instance de Bills avec le mock de store
      let newBill = new NewBill({ document, store: mockStore });

      // Spy sur la méthode handleChangeFile
      const spyOn = jest.spyOn(newBill, "handleChangeFile");

      // Créer un fichier simulé
      const file = new File(["dummy content"], "photo.jpg", { type: "image/jpg" });

      // Créer un objet événement simulé
      const event = {
        preventDefault: jest.fn(),
        target: {
          value: "C:\\fakepath\\photo.jpg",
          files: [file],
        },
      };

      // Appeler la méthode handleChangeFile avec cet événement simulé
      newBill.handleChangeFile(event);

      // Vérifier que la méthode a été appelée
      await waitFor(() => {
        expect(spyOn).toHaveBeenCalled();
      });

      expect(global.alert).not.toHaveBeenCalled();
    });
  });
});
