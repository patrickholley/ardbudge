import { PageComponents, Paths, Routes } from "@app-types/router";
import getKeysFromObject from "@utils/getKeysFromObject";

const pageKeys = getKeysFromObject(Paths);

const routes: Routes = pageKeys.reduce((routesObj, key) => {
    const path = Paths[key];
    const page = PageComponents[key];
    return { ...routesObj, [path]: page };
}, {} as Routes);

export default {
    Routes: routes
};
