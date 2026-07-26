/// <reference types="cypress" />

import { addClerkCommands } from "@clerk/testing/cypress";
import "./commands";

addClerkCommands({ Cypress, cy });
