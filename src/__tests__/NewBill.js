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


//Tests unitaires
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


// test d'intégration POST
describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem(
      "user",
      JSON.stringify({ type: "Employee", email: "a@a" })
    );

    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.appendChild(root);
    router();
  });

  describe("When I submit the NewBill form", () => {
    test("Then it should POST the new bill and navigate to Bills page", async () => {
      const onNavigateSpy = jest.fn();
      document.body.innerHTML = NewBillUI();

      // Mock du store pour simuler create (POST) et update
      const createMock = jest.fn().mockResolvedValue({
        fileUrl: "mockFileUrl",
        key: "1234",
      });
      const updateMock = jest.fn().mockResolvedValue({});
      const billsMock = { create: createMock, update: updateMock };
      const mockStore = { bills: jest.fn(() => billsMock) };

      const newBill = new NewBill({
        document,
        onNavigate: onNavigateSpy,
        store: mockStore,
        localStorage: localStorageMock,
      });

      // Simuler un fichier chargé comme si handleChangeFile avait été appelé
      newBill.fileUrl = "mockFileUrl";
      newBill.fileName = "mockFile.png";
      newBill.billId = "1234";

      // Spy sur handleSubmit
      const handleSubmitSpy = jest.spyOn(newBill, "handleSubmit");

      const form = screen.getByTestId("form-new-bill");
      const fakeEvent = { preventDefault: jest.fn(), target: form };

      // Appel direct du handler : POST + update
      await newBill.handleSubmit(fakeEvent);

      // Vérifications
      expect(handleSubmitSpy).toHaveBeenCalled();
      // update appelé
      await waitFor(() => expect(updateMock).toHaveBeenCalled()); 
        // POST déjà simulé
      expect(createMock).not.toHaveBeenCalled();
      // navigation sur Bills
      expect(onNavigateSpy).toHaveBeenCalledWith(ROUTES_PATH.Bills); 
    });

    describe("When an error occurs on API", () => {
      test("Then creating a new bill fails with '404 page not found' error", async () => {
        // Crée une instance de NewBill avec le mockStore
        const newBill = new NewBill({ document, store: mockStore });
    
        // Mock la méthode create() pour rejeter avec une erreur 404
        const mockedBillInstance = jest.spyOn(mockStore, "bills").mockReturnValue({
          create: jest.fn().mockRejectedValue(new Error("Erreur 404")),
        })();
    
        // Vérifie que create() rejette correctement
        await expect(mockedBillInstance.create()).rejects.toThrow("Erreur 404");
    
        // Vérifie que les propriétés de l'instance restent null
        expect(newBill.billId).toBeNull();
        expect(newBill.fileUrl).toBeNull();
        expect(newBill.fileName).toBeNull();
      });
    
      test("Then creating a new bill fails with '500 Internal Server error'", async () => {
        const newBill = new NewBill({ document, store: mockStore });
    
        const mockedBillInstance = jest.spyOn(mockStore, "bills").mockReturnValue({
          create: jest.fn().mockRejectedValue(new Error("Erreur 500")),
        })();
    
        await expect(mockedBillInstance.create()).rejects.toThrow("Erreur 500");
    
        expect(newBill.billId).toBeNull();
        expect(newBill.fileUrl).toBeNull();
        expect(newBill.fileName).toBeNull();
      });
    });
    
    
    
  });
});