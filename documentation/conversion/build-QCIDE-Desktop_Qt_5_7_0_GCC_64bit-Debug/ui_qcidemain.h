/********************************************************************************
** Form generated from reading UI file 'qcidemain.ui'
**
** Created by: Qt User Interface Compiler version 5.7.0
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_QCIDEMAIN_H
#define UI_QCIDEMAIN_H

#include <QtCore/QVariant>
#include <QtWidgets/QAction>
#include <QtWidgets/QApplication>
#include <QtWidgets/QButtonGroup>
#include <QtWidgets/QGraphicsView>
#include <QtWidgets/QHeaderView>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QMenu>
#include <QtWidgets/QMenuBar>
#include <QtWidgets/QStatusBar>
#include <QtWidgets/QTextBrowser>
#include <QtWidgets/QTextEdit>
#include <QtWidgets/QToolBar>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_QCIDEMain
{
public:
    QAction *actionLoad;
    QAction *actionCompile_Circuit;
    QAction *actionSave;
    QWidget *centralWidget;
    QTextEdit *textEdit;
    QGraphicsView *graphicsView;
    QTextBrowser *textBrowser;
    QMenuBar *menuBar;
    QMenu *menuQuantum_Assembly_IDE_v_1_0;
    QToolBar *mainToolBar;
    QStatusBar *statusBar;

    void setupUi(QMainWindow *QCIDEMain)
    {
        if (QCIDEMain->objectName().isEmpty())
            QCIDEMain->setObjectName(QStringLiteral("QCIDEMain"));
        QCIDEMain->resize(877, 474);
        actionLoad = new QAction(QCIDEMain);
        actionLoad->setObjectName(QStringLiteral("actionLoad"));
        actionCompile_Circuit = new QAction(QCIDEMain);
        actionCompile_Circuit->setObjectName(QStringLiteral("actionCompile_Circuit"));
        actionSave = new QAction(QCIDEMain);
        actionSave->setObjectName(QStringLiteral("actionSave"));
        centralWidget = new QWidget(QCIDEMain);
        centralWidget->setObjectName(QStringLiteral("centralWidget"));
        textEdit = new QTextEdit(centralWidget);
        textEdit->setObjectName(QStringLiteral("textEdit"));
        textEdit->setGeometry(QRect(20, 10, 481, 391));
        graphicsView = new QGraphicsView(centralWidget);
        graphicsView->setObjectName(QStringLiteral("graphicsView"));
        graphicsView->setGeometry(QRect(510, 10, 361, 201));
        textBrowser = new QTextBrowser(centralWidget);
        textBrowser->setObjectName(QStringLiteral("textBrowser"));
        textBrowser->setGeometry(QRect(510, 220, 361, 181));
        QCIDEMain->setCentralWidget(centralWidget);
        menuBar = new QMenuBar(QCIDEMain);
        menuBar->setObjectName(QStringLiteral("menuBar"));
        menuBar->setGeometry(QRect(0, 0, 877, 19));
        menuQuantum_Assembly_IDE_v_1_0 = new QMenu(menuBar);
        menuQuantum_Assembly_IDE_v_1_0->setObjectName(QStringLiteral("menuQuantum_Assembly_IDE_v_1_0"));
        QCIDEMain->setMenuBar(menuBar);
        mainToolBar = new QToolBar(QCIDEMain);
        mainToolBar->setObjectName(QStringLiteral("mainToolBar"));
        QCIDEMain->addToolBar(Qt::TopToolBarArea, mainToolBar);
        statusBar = new QStatusBar(QCIDEMain);
        statusBar->setObjectName(QStringLiteral("statusBar"));
        QCIDEMain->setStatusBar(statusBar);

        menuBar->addAction(menuQuantum_Assembly_IDE_v_1_0->menuAction());
        menuQuantum_Assembly_IDE_v_1_0->addAction(actionSave);
        menuQuantum_Assembly_IDE_v_1_0->addAction(actionLoad);
        menuQuantum_Assembly_IDE_v_1_0->addAction(actionCompile_Circuit);

        retranslateUi(QCIDEMain);

        QMetaObject::connectSlotsByName(QCIDEMain);
    } // setupUi

    void retranslateUi(QMainWindow *QCIDEMain)
    {
        QCIDEMain->setWindowTitle(QApplication::translate("QCIDEMain", "QCIDEMain", 0));
        actionLoad->setText(QApplication::translate("QCIDEMain", "Load", 0));
        actionCompile_Circuit->setText(QApplication::translate("QCIDEMain", "Compile Circuit", 0));
        actionSave->setText(QApplication::translate("QCIDEMain", "Save", 0));
        menuQuantum_Assembly_IDE_v_1_0->setTitle(QApplication::translate("QCIDEMain", "File", 0));
    } // retranslateUi

};

namespace Ui {
    class QCIDEMain: public Ui_QCIDEMain {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_QCIDEMAIN_H
