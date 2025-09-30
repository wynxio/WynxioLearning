import { StudentLayout } from "@/app/components/StudentLayout";


export default function HtmlClasses() {
    return (
        <StudentLayout>
            <div className="container py-4">
                <h2 className="mb-4 text-center">
                    HTML Classes
                </h2>

                <div className="container py-5 minh800">
                    <h2 className="fw-bold text-center text-white mb-5">
                        Wynxio Class Demos
                    </h2>

                    <div className="row justify-content-center">
                        {/* Demo Class Part 1 */}
                        <div className="col-lg-8 mb-5">
                            <div className="card shadow-lg border-0 rounded-4">
                                <div className="card-body p-4">
                                    <h4 className="fw-semibold mb-3 text-center">
                                        HTML Class - Part 1
                                    </h4>
                                    <div className="ratio ratio-16x9">
                                        <video controls className="rounded-3 w-100" muted>
                                            <source src="https://www.fileswynxio.com/uploads/ad104112-4fa3-409f-a2c9-1da19b7e3e94.mp4" type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Demo Class Part 2 */}
                        <div className="col-lg-8 mb-5">
                            <div className="card shadow-lg border-0 rounded-4">
                                <div className="card-body p-4">
                                    <h4 className="fw-semibold mb-3 text-center">
                                        HTML Class - Part 2
                                    </h4>
                                    <div className="ratio ratio-16x9">
                                        <video controls className="rounded-3 w-100" muted>
                                            <source src="https://www.fileswynxio.com/uploads/3ea4374b-3466-43c6-ac02-5136f04698a0.mp4" type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="col-lg-8 mb-5">
                            <div className="card shadow-lg border-0 rounded-4">
                                <div className="card-body p-4">
                                    <h4 className="fw-semibold mb-3 text-center">
                                        HTML Class - Part 3
                                    </h4>
                                    <div className="ratio ratio-16x9">
                                        <video controls className="rounded-3 w-100" muted>
                                            <source src="https://www.fileswynxio.com/uploads/fe534f02-21a0-480f-ae04-7fe136fe7f12.mp4" type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="col-lg-8 mb-5">
                            <div className="card shadow-lg border-0 rounded-4">
                                <div className="card-body p-4">
                                    <h4 className="fw-semibold mb-3 text-center">
                                        HTML Class - Part 4
                                    </h4>
                                    <div className="ratio ratio-16x9">
                                        <video controls className="rounded-3 w-100" muted>
                                            <source src="https://www.fileswynxio.com/uploads/1d13b400-1b87-4719-b075-fa3d8f2bcbcc.mp4" type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </StudentLayout>
    );
}