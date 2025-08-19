/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";
import mockedBills from "../__mocks__/store.js";
import "@testing-library/jest-dom";
import $ from "jquery";

// import { render, fireEvent, screen } from "@testing-library/react";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
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
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy();
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
        .map(a => a.innerHTML);
      bills.sort();
      dates.map(a => new Date(a));

      const antiChrono = (a, b) => new Date(a.date) - new Date(b.date);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
    test("must navigate to NewBill page by clicking on the 'Nouvelle facture' button", async () => {
      // Mock de la fonction de navigation
      const onNavigate = jest.fn();

      // Créer un conteneur pour simuler le DOM
      document.body.innerHTML = `
          <div>
            <button data-testid="btn-new-bill">Nouvelle facture</button>
          </div>
        `;

      // Initialiser l'instance de Bills avec le mock
      const bills = new Bills({ document, onNavigate });

      const buttonNewBill = screen.getByTestId("btn-new-bill");
      fireEvent.click(buttonNewBill);

      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);
    });

    test("Modal should appear by clicking on the eye icon", async () => {
      $.fn.modal = jest.fn();

      document.body.innerHTML = `
        <div id="eye" data-testid="icon-eye" data-bill-url="http://localhost:5678/public/b83fe7efc840eb3db0d60bbc5df3b2ea"></div>
        <div class="modal fade" id="modaleFile" data-testid="modal-test" style="display: none;"></div>
      `;

      // Initialiser la classe Bills
      let bills = new Bills({ document });
      const spyOn = jest.spyOn(bills, "handleClickIconEye");
      const iconEye = screen.getByTestId("icon-eye");
      fireEvent.click(iconEye);

      await waitFor(() => {
        expect(spyOn).toHaveBeenCalled();
        expect($.fn.modal).toHaveBeenCalledWith("show"); // Vérifie si la méthode modal a été appelée
      });
    });
  });
});
