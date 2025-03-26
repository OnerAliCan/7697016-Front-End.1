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
    test("tbd", async () => {
      global.alert = jest.fn();

      // Mock de la fonction de navigation
      const onNavigate = jest.fn();

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

      // Créer un conteneur pour simuler le DOM
      document.body.innerHTML = `
        <div class="form-newbill-container content-inner">
          <form data-testid="form-new-bill">
            <select data-testid="expense-type">
              <option value="Transports">Transports</option>
            </select>
            <input type="text" data-testid="expense-name" placeholder="Vol Paris Londres" />
            <input type="date" data-testid="datepicker" />
            <input type="number" data-testid="amount" placeholder="348" />
            <input type="number" data-testid="vat" placeholder="70" />
            <input type="number" data-testid="pct" placeholder="20" />
            <textarea data-testid="commentary" placeholder="Déplacement professionnel"></textarea>
            <input type="file" data-testid="file" />
            <button type="submit" id="btn-send-bill" class="btn btn-primary">Envoyer</button>
          </form>
        </div>
      `;

      // Initialiser l'instance de NewBill
      let newBill = new NewBill({ document, onNavigate, store: mockStore });

      // Spy sur la méthode handleSubmit
      console.log("test handleSubmit", newBill.handleSubmit);
      const spyOnSubmit = jest.spyOn(newBill, "handleSubmit");

      // Remplir les champs du formulaire
      fireEvent.change(screen.getByTestId("expense-type"), { target: { value: "Transports" } });
      fireEvent.change(screen.getByTestId("expense-name"), { target: { value: "Vol Paris Londres" } });
      fireEvent.change(screen.getByTestId("datepicker"), { target: { value: "2023-05-01" } });
      fireEvent.change(screen.getByTestId("amount"), { target: { value: "348" } });
      fireEvent.change(screen.getByTestId("vat"), { target: { value: "70" } });
      fireEvent.change(screen.getByTestId("pct"), { target: { value: "20" } });
      fireEvent.change(screen.getByTestId("commentary"), { target: { value: "Déplacement professionnel" } });

      // Créer un fichier simulé
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

      // Simuler la soumission du formulaire avec un fireEvent.submit
      // const form = screen.getByTestId("form-new-bill");
      // fireEvent.submit(form);

      const submitButton = document.getElementById("btn-send-bill");
      fireEvent.click(submitButton);

      // Vérifier que la méthode handleSubmit a bien été appelée
      await waitFor(() => {
        expect(spyOnSubmit).toHaveBeenCalled();
      });

      // Vérifier que les propriétés fileUrl et fileName sont bien définies
      expect(newBill.fileName).toBe("image.jpg");
      expect(newBill.fileUrl).not.toBeNull();
    });
  });
  describe("When I am on NewBill Page and upload a file without .jpg, .jpeg or .png extension", () => {
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
});
